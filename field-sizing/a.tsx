const { useState } = React;

function ComparisonItem({ title, badge, children, description }) {
  const badgeClass =
    badge === "fixed"
      ? "bg-yellow-400 dark:bg-yellow-500 text-black dark:text-gray-900"
      : "bg-green-500 dark:bg-green-600 text-white";

  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-xl border-2 border-gray-200 dark:border-gray-700">
      <h3 className="text-gray-700 dark:text-gray-200 text-lg mb-4 text-center font-semibold">
        {title}
        <span
          className={`${badgeClass} px-3 py-1 rounded-full text-xs font-semibold ml-2`}
        >
          {badge}
        </span>
      </h3>
      {children}
      <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 dark:border-blue-500 rounded text-sm text-gray-600 dark:text-gray-300">
        {description}
      </div>
    </div>
  );
}

const Component = () => {
  const [inputFixed, setInputFixed] = useState("");
  const [inputContent, setInputContent] = useState("");

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <ComparisonItem
        title="传统固定尺寸"
        badge="fixed"
        description="使用 field-sizing: fixed（默认值），输入框保持固定宽度，长文本会水平滚动。"
      >
        <label className="block mb-2 text-gray-700 dark:text-gray-300 font-medium">
          尝试输入长文本：
        </label>
        <input
          type="text"
          value={inputFixed}
          onChange={(e) => setInputFixed(e.target.value)}
          placeholder="固定宽度，内容可能溢出..."
          className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg text-base focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500"
          style={{ fieldSizing: "fixed" }}
        />
      </ComparisonItem>

      <ComparisonItem
        title="内容自适应"
        badge="content"
        description="使用 field-sizing: content，输入框宽度随内容自动调整（设置了 min/max 约束）。"
      >
        <label className="block mb-2 text-gray-700 dark:text-gray-300 font-medium">
          尝试输入长文本：
        </label>
        <input
          type="text"
          value={inputContent}
          onChange={(e) => setInputContent(e.target.value)}
          placeholder="宽度会随内容增长..."
          className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg text-base focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500"
          style={{ fieldSizing: "content", minWidth: "10ch", maxWidth: "100%" }}
        />
      </ComparisonItem>
    </div>
  );
};
