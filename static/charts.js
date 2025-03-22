function renderCharts(sentiment) {
  const ctxBar = document.getElementById("sentimentBar").getContext("2d");
  new Chart(ctxBar, {
    type: "bar",
    data: {
      labels: ["Negative", "Neutral", "Positive"],
      datasets: [
        {
          label: "Sentiment Scores (%)",
          data: [sentiment.neg * 100, sentiment.neu * 100, sentiment.pos * 100],
          backgroundColor: ["#e74c3c", "#f39c12", "#2ecc71"],
          borderRadius: 10,
        },
      ],
    },
    options: {
      responsive: false,
      indexAxis: "y",
      scales: {
        x: { beginAtZero: true, max: 100 },
      },
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: "Vader Sentiment Analysis",
          font: { size: 18 },
          color: "#333",
          padding: { bottom: 10 },
        },
      },
    },
  });

  const normalizedSentimentScore = (sentiment.compound + 1) * 50;

  const ctxCompound = document.getElementById("compoundChart").getContext("2d");
  new Chart(ctxCompound, {
    type: "bar",
    data: {
      labels: ["Sentiment Value"],
      datasets: [
        {
          label: "Sentiment Progress",
          data: [normalizedSentimentScore],
          backgroundColor:
            normalizedSentimentScore < 30
              ? "#e74c3c"
              : normalizedSentimentScore < 70
              ? "#f39c12"
              : "#2ecc71",
          borderColor: "#333",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: false,
      scales: {
        y: {
          beginAtZero: true,
          min: 0,
          max: 100,
          ticks: {
            stepSize: 25,
          },
        },
        x: {
          ticks: {
            display: false,
          },
        },
      },
      plugins: {
        tooltip: {
          enabled: true,
        },
        legend: {
          display: true,
          position: "bottom",
        },
        title: {
          display: true,
          text: "Custom Model Sentiment Analysis",
          font: {
            size: 18,
          },
          color: "#333",
          padding: { bottom: 10 },
        },
      },
    },
  });
}
