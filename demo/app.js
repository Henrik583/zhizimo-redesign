"use strict";

// The chart's Streamlit-specific DOM guard is unnecessary in this static shell.
window.__dshDomGuard = true;

document.addEventListener("DOMContentLoaded", () => {
  const chart = document.getElementById("charts");
  const exportButton = document.getElementById("export");
  const integers = new Intl.NumberFormat("zh-CN", { maximumFractionDigits: 0 });
  const decimals = new Intl.NumberFormat("zh-CN", { maximumFractionDigits: 1 });
  let chartData;
  let frameObserver;

  function setText(id, value) {
    document.getElementById(id).textContent = value;
  }

  function hours(value) {
    return Number.isFinite(value) ? integers.format(value) + " h" : "—";
  }

  function displayResult(threshold, p5, p50, p95, crossed, total) {
    setText("active-threshold", "当前失效阈值 FT = " + threshold.toFixed(1) + "%");
    setText("p5", hours(p5));
    setText("p50", hours(p50));
    setText("p95", hours(p95));
    setText("crossed", integers.format(crossed) + " / " + integers.format(total));
    setText("censor-rate", "未越阈 " + decimals.format(100 * (1 - crossed / total)) + "%");
  }

  function applySummary(summary) {
    setText("record-count", integers.format(summary.recordCount) + " 条");
    setText("record-duration", decimals.format(summary.duration) + " h");
    setText("path-count", integers.format(summary.total) + " 条");
    if (!chartData) {
      displayResult(summary.recordThreshold, summary.p5, summary.p50, summary.p95, summary.crossed, summary.total);
    }
  }

  function displayChartResult(slider) {
    const i = Number(slider.value);
    const data = chartData;
    displayResult(data.ft[i], data.p5[i], data.p50[i], data.p95[i], data.n_paths_valid[i], data.n_paths);
  }

  function connectChart() {
    const frame = chart.contentWindow;
    const frameDocument = chart.contentDocument;
    const data = frame.DATA;
    const slider = frameDocument.getElementById("rng");
    const wrap = frameDocument.getElementById("wrap");
    if (!data || !slider || !wrap || chartData === data) return;

    chartData = data;
    displayChartResult(slider);
    slider.addEventListener("input", () => displayChartResult(slider));
    exportButton.disabled = false;
    document.getElementById("load-error").hidden = true;

    function matchChartHeight() {
      chart.height = Math.ceil(wrap.getBoundingClientRect().height + 4);
    }

    frameObserver?.disconnect();
    frameObserver = new ResizeObserver(matchChartHeight);
    frameObserver.observe(wrap);
    matchChartHeight();
  }

  function downloadThresholds() {
    if (!chartData) return;
    const data = chartData;
    const headings = ["FT_percent", "threshold_V", "P5_h", "P50_h", "P95_h", "crossed_paths", "total_paths", "not_crossed_percent"];
    const rows = data.ft.map((threshold, i) => [
      threshold.toFixed(1), data.uth[i], data.p5[i], data.p50[i], data.p95[i],
      data.n_paths_valid[i], data.n_paths, data.cens[i],
    ].map((value) => Number.isFinite(Number(value)) && value !== null ? value : ""));
    const csv = [headings, ...rows].map((row) => row.join(",")).join("\r\n") + "\r\n";
    const file = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(file);
    const download = document.createElement("a");
    download.href = url;
    download.download = "PEMFC_FC1_thresholds.csv";
    document.body.append(download);
    download.click();
    download.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setText("export-status", "已导出 " + rows.length + " 档失效阈值");
  }

  chart.addEventListener("load", connectChart);
  connectChart();
  exportButton.addEventListener("click", downloadThresholds);

  fetch("summary.json")
    .then((response) => {
      if (!response.ok) throw new Error("Cannot read FC1 summary");
      return response.json();
    })
    .then(applySummary)
    .catch(() => {
      if (!chartData) document.getElementById("load-error").hidden = false;
    });
});
