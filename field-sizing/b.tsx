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
    const [textareaFixed, setTextareaFixed] = useState('');
    const [textareaContent, setTextareaContent] = useState('');

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <ComparisonItem
        title="传统固定高度"
        badge="fixed"
        description="传统 textarea 需要设置 rows 属性，内容过多时会出现滚动条。"
      >
        <label className="block mb-2 text-gray-700 font-medium">
          尝试输入多行文本：
        </label>
        <textarea
          value={textareaFixed}
          onChange={(e) => setTextareaFixed(e.target.value)}
          rows="4"
          placeholder="固定4行高度，内容过多会出现滚动条..."
          className="w-full p-3 border-2 border-gray-300 rounded-lg text-base focus:outline-none focus:border-indigo-500 transition-colors resize-none"
          style={{ fieldSizing: "fixed" }}
        />
      </ComparisonItem>

      <ComparisonItem
        title="自动增长"
        badge="content"
        description="使用 field-sizing: content，textarea 高度自动适应内容（3-15行）。"
      >
        <label className="block mb-2 text-gray-700 font-medium">
          尝试输入多行文本：
        </label>
        <textarea
          value={textareaContent}
          onChange={(e) => setTextareaContent(e.target.value)}
          placeholder="高度会随内容自动增长...&#10;继续换行...&#10;无需滚动条！"
          className="w-full p-3 border-2 border-gray-300 rounded-lg text-base focus:outline-none focus:border-indigo-500 transition-colors resize-none"
          style={{
            fieldSizing: "content",
            minHeight: "3lh",
            maxHeight: "15lh",
          }}
        />
      </ComparisonItem>
    </div>
  );
};
