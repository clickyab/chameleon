let axisCommon = function () {
  return {
    axisLine: {
      lineStyle: {
        color: "#fff"
      }
    },
    axisTick: {
      lineStyle: {
        color: "#f3f5f7"
      }
    },
    axisLabel: {
      textStyle: {
        color: "#485465"
      }
    },
    splitLine: {
      lineStyle: {
        // type: "line",
        color: "#f3f5f7"
      }
    },
    splitArea: {
      areaStyle: {
        color: "red"
      }
    }
  };
};
let contrastColor = "#fff";
let colorPalette = ["rgba(65,182,230,1)", "rgba(65,156,120,0.30)", "#EEBB3B", "#EC4E32", "#7460EE", "#eedd78", "#73a373", "#73b9bc", "#7289ab", "#91ca8c", "#f49f42"];
let theme = {
  color: colorPalette,
  backgroundColor: "#fff",
  tooltip: {
    axisPointer: {
      lineStyle: {
        color: "red"
      },
      crossStyle: {
        color: "red"
      }
    }
  },
  legend: {
    textStyle: {
      color: "#485465"
    }
  },
  textStyle: {
    color: "red"
  },
  title: {
    textStyle: {
      color: contrastColor
    }
  },
  toolbox: {
    iconStyle: {
      normal: {
        borderColor: "red"
      }
    }
  },
  dataZoom: {
    textStyle: {
      color: contrastColor
    }
  },
  visualMap: {
    textStyle: {
      color: contrastColor
    }
  },
  timeline: {
    lineStyle: {
      color: contrastColor
    },
    itemStyle: {
      normal: {
        color: colorPalette[1]
      }
    },
    label: {
      normal: {
        textStyle: {
          color: "red"
        }
      }
    },
    controlStyle: {
      normal: {
        color: "red",
        borderColor: contrastColor
      }
    }
  },
  timeAxis: axisCommon(),
  logAxis: axisCommon(),
  valueAxis: axisCommon(),
  categoryAxis: axisCommon(),

  line: {
    symbol: "circle"
  },
  graph: {
    color: colorPalette
  },
  gauge: {
    title: {
      textStyle: {
        color: "red"
      }
    }
  },
  candlestick: {
    itemStyle: {
      normal: {
        color: "#FD1050",
        color0: "#0CF49B",
        borderColor: "#FD1050",
        borderColor0: "#0CF49B"
      }
    }
  }
};

export default theme;
export {colorPalette, contrastColor, axisCommon};
