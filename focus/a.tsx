const { useRef, useEffect, useState } = React;

const Component = () => {
  const [logs, setLogs] = useState([]);

  const orderContainerRef = useRef(null);

  const addLog = (eventType, target, extra = "") => {
    const timestamp = new Date().toLocaleTimeString("zh-CN", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      fractionalSecondDigits: 3,
    });
    setLogs((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        time: timestamp,
        event: eventType,
        target: target,
        extra: extra,
        color: getEventColor(eventType),
      },
    ]);
  };

  const getEventColor = (eventType) => {
    const colors = {
      focusout: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
      focusin:
        "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
      blur: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300",
      focus: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
    };
    return (
      colors[eventType] ||
      "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
    );
  };

  const clearLogs = () => {
    setLogs([]);
  };

  useEffect(() => {
    const container = orderContainerRef.current;
    if (!container) return;

    const inputs = container.querySelectorAll("input");

    const setupListeners = (input, name) => {
      input.addEventListener("focusout", () => addLog("focusout", name));
      input.addEventListener("focusin", () => addLog("focusin", name));
      input.addEventListener("blur", () => addLog("blur", name));
      input.addEventListener("focus", () => addLog("focus", name));
    };

    inputs.forEach((input, index) => {
      setupListeners(input, `元素 ${String.fromCharCode(65 + index)}`);
    });
  }, []);

  return (
    <div className="bg-gray-50 dark:bg-[#222] p-4 rounded-lg flex flex-col gap-4">
      <div
        ref={orderContainerRef}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            元素 A
          </label>
          <input
            type="text"
            placeholder="点击聚焦到元素 A"
            className="w-full px-4 py-3 border-2 border-blue-300 dark:border-blue-600 rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            元素 B
          </label>
          <input
            type="text"
            placeholder="点击聚焦到元素 B"
            className="w-full px-4 py-3 border-2 border-green-300 dark:border-green-600 rounded-lg focus:outline-none focus:border-green-500 dark:focus:border-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>
      <div className="rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            事件日志面板
          </h2>
          <button
            onClick={clearLogs}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium"
          >
            清空日志
          </button>
        </div>

        <div className="p-4 border-2 border-dashed border-yellow-300 dark:border-yellow-600 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
          {logs.length === 0 ? (
            <div className="text-center py-6">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-gray-400 dark:text-gray-600 text-lg">
                暂无事件日志，请在上方示例中进行操作...
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className={`flex items-center justify-between p-3 rounded-lg ${log.color} animate-slide-in`}
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <span className="font-mono font-bold text-sm">
                      {log.event}
                    </span>
                    <span className="text-sm opacity-80">@ {log.target}</span>
                    {log.extra && (
                      <span className="text-xs opacity-70 italic">
                        {log.extra}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-mono opacity-60">
                    {log.time}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
