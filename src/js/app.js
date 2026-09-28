/**
 * Pollination Desk — flower shape ↔ pollinator matching with fruit-set link.
 * Source is well-commented; npm run watch minifies into docs/js/app.js.
 */
(function () {
  "use strict";

  const MODE_KEY = "pollination-desk-mode";
  const state = {
    mode: "simple",
    flowers: [],
    pollinators: [],
    citations: [],
    selectedFlowerId: null,
    selectedGuildId: null,
  };

  const els = {};

  function $(id) {
    return document.getElementById(id);
  }

  function loadMode() {
    const saved = localStorage.getItem(MODE_KEY);
    state.mode = saved === "advanced" ? "advanced" : "simple";
  }

  function saveMode() {
    localStorage.setItem(MODE_KEY, state.mode);
  }

  async function loadData() {
    const base = new URL("./data/", window.location.href);
    const [flowers, pollinators, citations] = await Promise.all([
      fetch(new URL("flowers.json", base)).then((r) => r.json()),
      fetch(new URL("pollinators.json", base)).then((r) => r.json()),
      fetch(new URL("citations.json", base)).then((r) => r.json()),
    ]);
    state.flowers = flowers;
    state.pollinators = pollinators;
    state.citations = citations;
  }

  function guildById(id) {
    return state.pollinators.find((g) => g.id === id);
  }

  function flowerById(id) {
    return state.flowers.find((f) => f.id === id);
  }

  /** Rough match score for Advanced mode: primary > secondary > guild.fitsShapes. */
  function matchScore(flower, guild) {
    if (!flower || !guild) return 0;
    if (flower.primaryGuilds.includes(guild.id)) return 3;
    if (flower.secondaryGuilds.includes(guild.id)) return 2;
    if (guild.fitsShapes.includes(flower.id)) return 1;
    if (flower.id === "cleistogamous") return guild.id ? 0 : 0;
    return 0;
  }

  function scoreLabel(score) {
    if (score >= 3) return "Strong match";
    if (score === 2) return "Secondary match";
    if (score === 1) return "Occasional fit";
    return "Poor fit";
  }

  function setMode(mode) {
    state.mode = mode === "advanced" ? "advanced" : "simple";
    saveMode();
    syncModeUi();
    render();
  }

  function syncModeUi() {
    const isAdvanced = state.mode === "advanced";
    els.modeSimple.setAttribute("aria-pressed", String(!isAdvanced));
    els.modeAdvanced.setAttribute("aria-pressed", String(isAdvanced));
    els.advancedPanel.hidden = !isAdvanced;
    els.simpleHint.hidden = isAdvanced;
    els.advancedHint.hidden = !isAdvanced;
    document.body.dataset.mode = state.mode;
  }

  function selectFlower(id) {
    state.selectedFlowerId = id;
    if (state.mode === "simple") {
      const flower = flowerById(id);
      state.selectedGuildId = flower && flower.primaryGuilds[0] ? flower.primaryGuilds[0] : null;
    }
    render();
  }

  function selectGuild(id) {
    state.selectedGuildId = id;
    render();
  }

  function renderFlowerGrid() {
    els.flowerGrid.innerHTML = "";
    state.flowers.forEach((flower) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className =
        "flower-tile flex flex-col gap-1 rounded-2xl border border-paper-line bg-white px-4 py-3 text-left transition hover:border-teal/40 hover:shadow-card focus:outline-none focus-visible:ring-2 focus-visible:ring-teal";
      btn.setAttribute("aria-pressed", String(flower.id === state.selectedFlowerId));
      btn.innerHTML =
        '<span class="font-display text-lg text-ink">' +
        escapeHtml(flower.name) +
        '</span><span class="text-sm text-ink-muted line-clamp-2">' +
        escapeHtml(flower.simpleBlurb) +
        "</span>";
      btn.addEventListener("click", () => selectFlower(flower.id));
      els.flowerGrid.appendChild(btn);
    });
  }

  function renderGuildChips(flower) {
    els.guildChips.innerHTML = "";
    if (!flower) {
      els.guildChips.hidden = true;
      return;
    }
    els.guildChips.hidden = false;
    const ids = unique([].concat(flower.primaryGuilds, flower.secondaryGuilds, state.mode === "advanced" ? state.pollinators.map((g) => g.id) : []));
    ids.forEach((id) => {
      const guild = guildById(id);
      if (!guild) return;
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className =
        "guild-chip rounded-full border border-paper-line bg-cream px-3 py-1.5 text-sm text-ink transition hover:border-pollen focus:outline-none focus-visible:ring-2 focus-visible:ring-pollen";
      chip.setAttribute("aria-pressed", String(id === state.selectedGuildId));
      const score = matchScore(flower, guild);
      chip.textContent =
        state.mode === "advanced" ? guild.name + " · " + scoreLabel(score) : guild.name;
      chip.addEventListener("click", () => selectGuild(id));
      els.guildChips.appendChild(chip);
    });
  }

  function renderDetail() {
    const flower = flowerById(state.selectedFlowerId);
    if (!flower) {
      els.detail.hidden = true;
      els.emptyDetail.hidden = false;
      return;
    }
    els.detail.hidden = false;
    els.emptyDetail.hidden = true;

    const guild = guildById(state.selectedGuildId);
    const score = matchScore(flower, guild);

    els.detailTitle.textContent = flower.name;
    els.detailShape.textContent = flower.shapeSummary;
    els.detailBlurb.textContent =
      state.mode === "simple" ? flower.simpleBlurb : flower.shapeSummary;

    els.detailColors.textContent = flower.colorCues.join(", ");
    els.detailExamples.textContent = flower.examples.join(", ");

    if (guild) {
      els.matchCard.hidden = false;
      els.matchTitle.textContent = guild.name;
      els.matchScore.textContent = scoreLabel(score);
      els.matchScore.className =
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold " +
        (score >= 3
          ? "bg-teal-mist text-teal-dim"
          : score === 2
            ? "bg-pollen/25 text-pollen-dim"
            : score === 1
              ? "bg-cream-deep text-ink-muted"
              : "bg-petal text-ink");
      els.matchWhy.textContent = whyMatch(flower, guild, score);
      if (state.mode === "advanced") {
        els.traitCompare.hidden = false;
        els.traitCompare.innerHTML = traitRows(flower, guild);
      } else {
        els.traitCompare.hidden = true;
        els.traitCompare.innerHTML = "";
      }
    } else {
      els.matchCard.hidden = true;
      els.matchWhy.textContent =
        flower.id === "cleistogamous"
          ? "This closed pathway sets fruit without a pollinator partner."
          : "Choose a pollinator guild to compare the fit.";
    }

    els.fruitSetCopy.textContent = flower.fruitSet;
    renderGuildChips(flower);
  }

  function whyMatch(flower, guild, score) {
    if (flower.id === "cleistogamous") {
      return "Cleistogamous flowers bypass animal vectors. Fruit still forms, but without the mixing that open flowers can provide.";
    }
    if (score >= 3) {
      return (
        guild.traits.notes +
        " The flower’s " +
        flower.traits.corollaDepth +
        " corolla and " +
        flower.traits.rewardType +
        " reward align with this guild’s foraging style, which is why pollen placement—and later fruit set—tends to be reliable when they are present at bloom."
      );
    }
    if (score === 2) {
      return (
        "This guild can move pollen here, though it is not the primary partner. " +
        guild.traits.notes +
        " Expect solid fruit set only when primary partners are scarce and these visitors are abundant."
      );
    }
    if (score === 1) {
      return (
        "Visits may happen, but morphology is a loose fit. " +
        guild.traits.notes +
        " Many visits can become nectar theft or pollen waste, which weakens fruit set."
      );
    }
    return (
      "Morphology and sensory cues pull apart. " +
      guild.traits.notes +
      " Busy-looking flowers can still set little fruit when the wrong visitors dominate."
    );
  }

  function traitRows(flower, guild) {
    const rows = [
      ["Corolla / access", flower.traits.corollaDepth, guild.traits.tongueLength],
      ["Symmetry", flower.traits.symmetry, "Body approach: " + guild.traits.bodySize],
      ["Landing", flower.traits.landingPlatform, "Activity: " + guild.traits.activityWindow],
      ["Reward", flower.traits.rewardType, guild.traits.notes],
      ["Scent / timing", flower.traits.scentTiming, "Vision: " + guild.traits.vision],
      ["UV / guides", flower.traits.uvGuides, "—"],
    ];
    return (
      '<dl class="grid gap-3 sm:grid-cols-2">' +
      rows
        .map(function (row) {
          return (
            '<div class="rounded-xl bg-cream-deep/60 p-3">' +
            '<dt class="text-xs font-semibold uppercase tracking-wide text-ink-faint">' +
            escapeHtml(row[0]) +
            "</dt>" +
            '<dd class="mt-1 text-sm text-ink"><span class="font-medium text-teal-dim">Flower:</span> ' +
            escapeHtml(row[1]) +
            '</dd><dd class="text-sm text-ink"><span class="font-medium text-pollen-dim">Pollinator:</span> ' +
            escapeHtml(row[2]) +
            "</dd></div>"
          );
        })
        .join("") +
      "</dl>"
    );
  }

  function renderCitations() {
    els.citationList.innerHTML = "";
    state.citations.forEach((c) => {
      const li = document.createElement("li");
      li.className = "text-sm leading-relaxed text-ink-muted";
      const a = document.createElement("a");
      a.href = c.url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.className = "text-teal underline decoration-teal/30 underline-offset-2 hover:decoration-teal";
      a.textContent = c.text;
      li.appendChild(a);
      const use = document.createElement("p");
      use.className = "mt-1 text-xs text-ink-faint";
      use.textContent = c.use;
      li.appendChild(use);
      els.citationList.appendChild(li);
    });
  }

  function render() {
    renderFlowerGrid();
    renderDetail();
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function unique(arr) {
    return arr.filter(function (v, i, a) {
      return v && a.indexOf(v) === i;
    });
  }

  function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) return;
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("./sw.js").catch(function () {
        /* offline cache is best-effort */
      });
    });
  }

  async function init() {
    els.modeSimple = $("mode-simple");
    els.modeAdvanced = $("mode-advanced");
    els.flowerGrid = $("flower-grid");
    els.guildChips = $("guild-chips");
    els.detail = $("detail");
    els.emptyDetail = $("empty-detail");
    els.detailTitle = $("detail-title");
    els.detailShape = $("detail-shape");
    els.detailBlurb = $("detail-blurb");
    els.detailColors = $("detail-colors");
    els.detailExamples = $("detail-examples");
    els.matchCard = $("match-card");
    els.matchTitle = $("match-title");
    els.matchScore = $("match-score");
    els.matchWhy = $("match-why");
    els.traitCompare = $("trait-compare");
    els.fruitSetCopy = $("fruit-set-copy");
    els.citationList = $("citation-list");
    els.simpleHint = $("simple-hint");
    els.advancedHint = $("advanced-hint");
    els.advancedPanel = $("advanced-panel");
    els.status = $("load-status");

    loadMode();
    els.modeSimple.addEventListener("click", function () {
      setMode("simple");
    });
    els.modeAdvanced.addEventListener("click", function () {
      setMode("advanced");
    });

    try {
      await loadData();
      els.status.textContent = "";
      if (!state.selectedFlowerId && state.flowers[0]) {
        state.selectedFlowerId = state.flowers[0].id;
        state.selectedGuildId = state.flowers[0].primaryGuilds[0] || null;
      }
      syncModeUi();
      renderCitations();
      render();
    } catch (err) {
      console.error(err);
      els.status.textContent =
        "Could not load desk data. Check that docs/data JSON files are present.";
    }

    registerServiceWorker();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
