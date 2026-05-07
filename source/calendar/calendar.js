(function () {
  "use strict";

  var EVENT_CACHE = null;
  var WEEKDAYS = ["一", "二", "三", "四", "五", "六", "日"];
  var MONTH_LABELS = [
    "一月",
    "二月",
    "三月",
    "四月",
    "五月",
    "六月",
    "七月",
    "八月",
    "九月",
    "十月",
    "十一月",
    "十二月",
  ];

  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function dateKey(date) {
    return date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate());
  }

  function monthKey(date) {
    return date.getFullYear() + "-" + pad(date.getMonth() + 1);
  }

  function parseDate(value) {
    if (!value) return null;
    if (value instanceof Date) return new Date(value.getFullYear(), value.getMonth(), value.getDate());

    var match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
    }

    var parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return null;
    return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
  }

  function formatDate(date) {
    return date.getFullYear() + " 年 " + pad(date.getMonth() + 1) + " 月 " + pad(date.getDate()) + " 日";
  }

  function formatMonth(date) {
    return date.getFullYear() + " " + MONTH_LABELS[date.getMonth()];
  }

  function startOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  function addMonths(date, count) {
    return new Date(date.getFullYear(), date.getMonth() + count, 1);
  }

  function daysBetween(a, b) {
    var start = new Date(a.getFullYear(), a.getMonth(), a.getDate());
    var end = new Date(b.getFullYear(), b.getMonth(), b.getDate());
    return Math.round((end.getTime() - start.getTime()) / 86400000);
  }

  function escapeHTML(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function normalizeEvents(events) {
    return events
      .map(function (event, index) {
        var start = parseDate(event.start);
        if (!start) return null;

        return {
          id: event.id || "event-" + index + "-" + dateKey(start),
          title: event.title || "未命名活动",
          start: start,
          key: dateKey(start),
          month: monthKey(start),
          url: event.url || "",
          location: event.location || "",
          description: event.description || "",
        };
      })
      .filter(Boolean)
      .sort(function (a, b) {
        return a.start - b.start || a.title.localeCompare(b.title, "zh-CN");
      });
  }

  function loadEvents(endpoint) {
    if (!EVENT_CACHE) {
      EVENT_CACHE = fetch(endpoint, {
        headers: { Accept: "application/json" },
      })
        .then(function (response) {
          if (!response.ok) throw new Error("HTTP " + response.status);
          return response.json();
        })
        .then(normalizeEvents)
        .catch(function (error) {
          EVENT_CACHE = null;
          throw error;
        });
    }

    return EVENT_CACHE;
  }

  function navigateTo(url) {
    if (!url) return;
    if (window.pjax && typeof window.pjax.loadUrl === "function") {
      window.pjax.loadUrl(url);
    } else {
      window.location.href = url;
    }
  }

  function groupByDate(events) {
    return events.reduce(function (map, event) {
      if (!map[event.key]) map[event.key] = [];
      map[event.key].push(event);
      return map;
    }, {});
  }

  function createCalendar(element) {
    var today = parseDate(new Date());
    var endpoint = element.dataset.calendarEndpoint || "/calendar/events.json";
    var haloTimer = null;
    var state = {
      events: [],
      byDate: {},
      today: today,
      currentMonth: startOfMonth(today),
      selectedDate: today,
      view: window.matchMedia("(max-width: 680px)").matches ? "list" : "month",
      monthMotion: "",
      loading: true,
      error: "",
    };

    function setMonth(date, motion) {
      var targetMonth = startOfMonth(date);
      var inferredMotion = motion || (targetMonth > state.currentMonth ? "next" : "prev");
      state.currentMonth = startOfMonth(date);
      if (monthKey(state.selectedDate) !== monthKey(state.currentMonth)) {
        state.selectedDate = state.currentMonth;
      }
      state.monthMotion = inferredMotion;
      render();
    }

    function setView(view) {
      state.view = view;
      state.monthMotion = "";
      render();
    }

    function eventsForDate(date) {
      return state.byDate[dateKey(date)] || [];
    }

    function monthEvents() {
      var key = monthKey(state.currentMonth);
      return state.events.filter(function (event) {
        return event.month === key;
      });
    }

    function nextEvent() {
      return state.events.find(function (event) {
        return event.start >= state.today;
      });
    }

    function buildShell() {
      var upcoming = nextEvent();
      var upcomingHTML = upcoming
        ? '<button class="zcal-next" type="button" data-action="jump-date" data-date="' +
          upcoming.key +
          '">' +
          '<span class="zcal-next-kicker">下次活动</span>' +
          '<strong>' +
          escapeHTML(upcoming.title) +
          "</strong>" +
          '<span>' +
          formatDate(upcoming.start) +
          "</span>" +
          "</button>"
        : '<div class="zcal-next zcal-next-empty"><span class="zcal-next-kicker">下次活动</span><strong>暂无近期活动</strong><span>敬请期待</span></div>';

      return (
        '<section class="zcal-panel" aria-label="ZJUTLUG 活动日历">' +
        '<div class="zcal-hero">' +
        '<div class="zcal-hero-copy">' +
        '<span class="zcal-eyebrow">ZJUTLUG Calendar</span>' +
        '<h2>活动日历</h2>' +
        "</div>" +
        upcomingHTML +
        "</div>" +
        '<div class="zcal-toolbar">' +
        '<div class="zcal-month-nav" aria-label="月份切换">' +
        '<button class="zcal-icon-btn" type="button" data-action="prev" aria-label="上个月"><span aria-hidden="true">&lsaquo;</span></button>' +
        '<button class="zcal-title-btn" type="button" data-action="today" aria-label="回到今天">' +
        '<span class="zcal-month-title">' +
        formatMonth(state.currentMonth) +
        "</span>" +
        '<span class="zcal-month-subtitle">点击回到今天</span>' +
        "</button>" +
        '<button class="zcal-icon-btn" type="button" data-action="next" aria-label="下个月"><span aria-hidden="true">&rsaquo;</span></button>' +
        "</div>" +
        '<div class="zcal-actions">' +
        '<button type="button" class="zcal-today-btn" data-action="today">今天</button>' +
        '<div class="zcal-segment" role="tablist" aria-label="日历视图">' +
        '<button type="button" role="tab" data-action="view" data-view="month" aria-selected="' +
        (state.view === "month") +
        '">月视图</button>' +
        '<button type="button" role="tab" data-action="view" data-view="list" aria-selected="' +
        (state.view === "list") +
        '">列表</button>' +
        "</div>" +
        "</div>" +
        "</div>" +
        '<div class="zcal-stage" data-view="' +
        state.view +
        '">' +
        (state.view === "month" ? buildMonthView() : buildListView()) +
        buildAgenda() +
        "</div>" +
        "</section>"
      );
    }

    function buildMonthView() {
      var start = startOfMonth(state.currentMonth);
      var offset = (start.getDay() + 6) % 7;
      var firstCell = new Date(start.getFullYear(), start.getMonth(), 1 - offset);
      var todayKey = dateKey(state.today);
      var selectedKey = dateKey(state.selectedDate);
      var motionClass = state.monthMotion ? " is-slide-" + state.monthMotion : "";
      var html = '<div class="zcal-month-view' + motionClass + '" aria-label="' + escapeHTML(formatMonth(state.currentMonth)) + '">';

      html += '<div class="zcal-weekdays">';
      WEEKDAYS.forEach(function (weekday) {
        html += "<span>" + weekday + "</span>";
      });
      html += "</div>";

      html += '<span class="zcal-selection-halo" aria-hidden="true"></span>';
      html += '<div class="zcal-grid">';
      for (var i = 0; i < 42; i += 1) {
        var day = new Date(firstCell.getFullYear(), firstCell.getMonth(), firstCell.getDate() + i);
        var key = dateKey(day);
        var dayEvents = eventsForDate(day);
        var isMuted = day.getMonth() !== state.currentMonth.getMonth();
        var classes = ["zcal-day"];
        if (isMuted) classes.push("is-muted");
        if (key === todayKey) classes.push("is-today");
        if (key === selectedKey) classes.push("is-selected");
        if (dayEvents.length) classes.push("has-events");

        html +=
          '<button class="' +
          classes.join(" ") +
          '" type="button" data-action="select-date" data-date="' +
          key +
          '" aria-label="' +
          escapeHTML(formatDate(day)) +
          (dayEvents.length ? "，" + dayEvents.length + " 个活动" : "") +
          '">';
        html += '<span class="zcal-day-number">' + day.getDate() + "</span>";

        if (dayEvents.length) {
          html += '<span class="zcal-day-events">';
          dayEvents.slice(0, 2).forEach(function (event) {
            html += '<span class="zcal-event-pill">' + escapeHTML(event.title) + "</span>";
          });
          if (dayEvents.length > 2) {
            html += '<span class="zcal-more">+' + (dayEvents.length - 2) + "</span>";
          }
          html += "</span>";
        }

        html += "</button>";
      }
      html += "</div></div>";
      return html;
    }

    function buildListView() {
      var events = monthEvents();
      var html = '<div class="zcal-list-view" aria-label="' + escapeHTML(formatMonth(state.currentMonth)) + '活动列表">';

      if (!events.length) {
        html += '<div class="zcal-empty"><strong>本月暂无活动</strong></div>';
      } else {
        events.forEach(function (event, index) {
          var delta = daysBetween(state.today, event.start);
          var tag = delta === 0 ? "今天" : delta > 0 ? delta + " 天后" : "已结束";
          html +=
            '<button class="zcal-list-item" type="button" data-action="' +
            (event.url ? "open-event" : "select-date") +
            '" data-date="' +
            event.key +
            '" data-url="' +
            escapeHTML(event.url) +
            '" style="--delay:' +
            index * 35 +
            'ms">';
          html += '<span class="zcal-list-date"><strong>' + pad(event.start.getDate()) + "</strong><em>" + MONTH_LABELS[event.start.getMonth()] + "</em></span>";
          html += '<span class="zcal-list-copy"><strong>' + escapeHTML(event.title) + "</strong>";
          html += '<span>' + formatDate(event.start) + (event.location ? " · " + escapeHTML(event.location) : "") + "</span></span>";
          html += '<span class="zcal-list-tag">' + tag + "</span>";
          html += "</button>";
        });
      }

      html += "</div>";
      return html;
    }

    function buildAgenda() {
      var selectedEvents = eventsForDate(state.selectedDate);
      var selectedLabel = formatDate(state.selectedDate);
      var currentMonthEvents = monthEvents();
      var monthTotal = currentMonthEvents.length;
      var html = "";

      if (state.view === "list") {
        var futureEvents = currentMonthEvents.filter(function (event) {
          return event.start >= state.today;
        });
        var nextInMonth = futureEvents[0] || currentMonthEvents[currentMonthEvents.length - 1];

        html = '<aside class="zcal-agenda" aria-label="本月活动概览">';
        html += '<div class="zcal-agenda-head"><span>本月概览</span><strong>' + formatMonth(state.currentMonth) + "</strong></div>";
        html += '<div class="zcal-stats">';
        html += '<div><strong>' + monthTotal + '</strong><span>本月活动</span></div>';
        html += '<div><strong>' + futureEvents.length + '</strong><span>后续活动</span></div>';
        html += "</div>";

        if (!monthTotal) {
          html += '<div class="zcal-empty zcal-empty-compact"><strong>本月暂无活动</strong><span>可以切换月份查看后续安排。</span></div>';
        } else {
          html += '<div class="zcal-agenda-note">';
          html += '<span>' + (futureEvents.length ? "本月下一场" : "本月最后一场") + "</span>";
          html += "<strong>" + escapeHTML(nextInMonth.title) + "</strong>";
          html += "<em>" + formatDate(nextInMonth.start) + "</em>";
          html += "</div>";
        }

        html += "</aside>";
        return html;
      }

      html = '<aside class="zcal-agenda" aria-label="选中日期活动">';

      html += '<div class="zcal-agenda-head"><span>选中日期</span><strong>' + selectedLabel + "</strong></div>";
      html += '<div class="zcal-stats">';
      html += '<div><strong>' + selectedEvents.length + '</strong><span>当日活动</span></div>';
      html += '<div><strong>' + monthTotal + '</strong><span>本月活动</span></div>';
      html += "</div>";

      if (!selectedEvents.length) {
        html += '<div class="zcal-empty zcal-empty-compact"><strong>这天没有排期</strong><span>点击有标记的日期查看活动。</span></div>';
      } else {
        html += '<div class="zcal-agenda-list">';
        selectedEvents.forEach(function (event) {
          html += '<article class="zcal-agenda-item">';
          html += '<span class="zcal-agenda-dot"></span>';
          html += '<div><strong>' + escapeHTML(event.title) + "</strong>";
          html += '<span>' + formatDate(event.start) + (event.location ? " · " + escapeHTML(event.location) : "") + "</span>";
          if (event.description) {
            html += "<p>" + escapeHTML(event.description) + "</p>";
          }
          if (event.url) {
            html += '<button type="button" data-action="open-event" data-url="' + escapeHTML(event.url) + '">查看详情</button>';
          }
          html += "</div></article>";
        });
        html += "</div>";
      }

      html += "</aside>";
      return html;
    }

    function renderLoading() {
      element.innerHTML =
        '<div class="zcal-panel zcal-loading" aria-busy="true">' +
        '<div class="zcal-loading-bar"></div>' +
        '<div class="zcal-loading-copy"><strong>正在整理活动日历</strong><span>加载社团近期活动安排...</span></div>' +
        "</div>";
    }

    function renderError() {
      element.innerHTML =
        '<div class="zcal-panel zcal-error">' +
        '<strong>活动日历加载失败</strong>' +
        '<span>' +
        escapeHTML(state.error || "请稍后重试。") +
        "</span>" +
        '<button type="button" data-action="retry">重新加载</button>' +
        "</div>";
    }

    function render() {
      if (state.loading) {
        renderLoading();
        return;
      }

      if (state.error) {
        renderError();
        return;
      }

      element.innerHTML = buildShell();
      state.monthMotion = "";
      requestAnimationFrame(function () {
        var stage = element.querySelector(".zcal-stage");
        if (stage) stage.classList.add("is-ready");
      });
    }

    function syncSelectionHalo() {
      if (state.view !== "month") return;

      var monthView = element.querySelector(".zcal-month-view");
      var halo = element.querySelector(".zcal-selection-halo");
      var selected = element.querySelector('.zcal-day[data-date="' + dateKey(state.selectedDate) + '"]');
      if (!monthView || !halo || !selected) return;

      window.clearTimeout(haloTimer);
      var viewRect = monthView.getBoundingClientRect();
      var selectedRect = selected.getBoundingClientRect();
      halo.style.setProperty("--halo-x", selectedRect.left - viewRect.left + "px");
      halo.style.setProperty("--halo-y", selectedRect.top - viewRect.top + "px");
      halo.style.setProperty("--halo-w", selectedRect.width + "px");
      halo.style.setProperty("--halo-h", selectedRect.height + "px");
      halo.classList.add("is-active");
      haloTimer = window.setTimeout(function () {
        halo.classList.remove("is-active");
      }, 560);
    }

    function clearSelectionHalo() {
      window.clearTimeout(haloTimer);
      haloTimer = null;
      var halo = element.querySelector(".zcal-selection-halo");
      if (halo) halo.classList.remove("is-active");
    }

    function updateAgendaOnly() {
      var agenda = element.querySelector(".zcal-agenda");
      if (!agenda) return;

      agenda.outerHTML = buildAgenda();
    }

    function selectDateInMonth(date) {
      var selectedKey = dateKey(date);
      state.selectedDate = date;

      element.querySelectorAll(".zcal-day.is-selected").forEach(function (day) {
        day.classList.remove("is-selected");
      });

      var selected = element.querySelector('.zcal-day[data-date="' + selectedKey + '"]');
      if (selected) {
        selected.classList.add("is-selected");
      }

      updateAgendaOnly();
      syncSelectionHalo();
    }

    function selectDate(date, source) {
      var targetMonth = startOfMonth(date);
      var previousMonth = state.currentMonth;
      var sameMonth = monthKey(targetMonth) === monthKey(state.currentMonth);

      if (state.view === "month" && sameMonth) {
        selectDateInMonth(date);
        return;
      }

      state.selectedDate = date;
      state.currentMonth = targetMonth;
      state.view = "month";

      if (source === "list") {
        state.monthMotion = "from-list";
      } else if (!sameMonth) {
        state.monthMotion = targetMonth > previousMonth ? "next" : "prev";
      } else {
        state.monthMotion = "";
      }

      render();
    }

    function hydrateEvents() {
      state.loading = true;
      state.error = "";
      render();

      loadEvents(endpoint)
        .then(function (events) {
          state.events = events;
          state.byDate = groupByDate(events);

          var upcoming = nextEvent();
          if (upcoming && !eventsForDate(state.selectedDate).length) {
            state.currentMonth = startOfMonth(upcoming.start);
            state.selectedDate = upcoming.start;
          }

          state.loading = false;
          render();
        })
        .catch(function (error) {
          state.loading = false;
          state.error = "无法读取 /calendar/events.json：" + error.message;
          render();
        });
    }

    element.addEventListener("click", function (event) {
      var control = event.target.closest("[data-action]");
      if (!control || !element.contains(control)) return;

      var action = control.dataset.action;
      if (action === "prev") {
        setMonth(addMonths(state.currentMonth, -1), "prev");
      } else if (action === "next") {
        setMonth(addMonths(state.currentMonth, 1), "next");
      } else if (action === "today") {
        if (state.view === "month" && monthKey(state.today) === monthKey(state.currentMonth)) {
          selectDateInMonth(state.today);
        } else {
          state.selectedDate = state.today;
          setMonth(state.today, state.today > state.currentMonth ? "next" : "prev");
        }
      } else if (action === "view") {
        setView(control.dataset.view || "month");
      } else if (action === "select-date" || action === "jump-date") {
        var selected = parseDate(control.dataset.date);
        if (!selected) return;
        selectDate(selected, action === "jump-date" ? "jump" : state.view === "list" ? "list" : "month");
      } else if (action === "open-event") {
        navigateTo(control.dataset.url);
      } else if (action === "retry") {
        EVENT_CACHE = null;
        hydrateEvents();
      }
    });

    window.addEventListener("resize", clearSelectionHalo, { passive: true });

    hydrateEvents();

    return {
      refresh: hydrateEvents,
    };
  }

  function initCalendar() {
    var element = document.getElementById("calendar");
    if (!element || element.__zjutCalendar) return;
    element.__zjutCalendar = createCalendar(element);
  }

  window.ZJUTLUGCalendar = {
    init: initCalendar,
    clearCache: function () {
      EVENT_CACHE = null;
    },
  };

  if (!window.__ZJUTLUG_CALENDAR_LISTENERS__) {
    window.__ZJUTLUG_CALENDAR_LISTENERS__ = true;
    document.addEventListener("DOMContentLoaded", initCalendar);
    document.addEventListener("pjax:complete", initCalendar);
  }

  initCalendar();
})();
