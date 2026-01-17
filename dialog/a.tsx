const handleDeleteClose = () => {
    const dialog = deleteDialogRef.current;
    addLog(`删除确认对话框关闭，返回值: "${dialog.returnValue}"`);

    if (dialog.returnValue === 'delete') {
        addLog('✓ 用户确认删除操作');
    } else if (dialog.returnValue === 'cancel') {
        addLog('✗ 用户取消删除操作');
    }
};

<dialog
    ref={deleteDialogRef}
    onClose={handleDeleteClose}
    className="backdrop:bg-black/50 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-0 border-0"
    >
    <form method="dialog" className="p-6 min-w-[400px]">
        <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">确认删除</h3>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
        此操作无法撤销。确定要删除这个项目吗？
        </p>
        <div className="flex gap-3 justify-end">
        <button
            type="submit"
            value="cancel"
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition"
        >
            取消
        </button>
        <button
            type="submit"
            value="delete"
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
        >
            删除
        </button>
        </div>
    </form>
</dialog>