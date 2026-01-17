const handleLoginSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const user = {
      username: formData.get('username'),
      email: formData.get('email')
    };
    setUsers([...users, user]);
    loginDialogRef.current?.close();
    e.target.reset();
};

<dialog
    ref={loginDialogRef}
    className="backdrop:bg-black/50 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-0 border-0"
    >
    <div className="p-6 min-w-[400px]">
        <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">用户登录</h3>
        <form onSubmit={handleLoginSubmit}>
        <div className="space-y-4 mb-6">
            <div>
            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                用户名
            </label>
            <input
                type="text"
                name="username"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="请输入用户名"
            />
            </div>
            <div>
            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                邮箱
            </label>
            <input
                type="email"
                name="email"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="请输入邮箱"
            />
            </div>
        </div>
        <div className="flex gap-3 justify-end">
            <button
            type="button"
            onClick={() => loginDialogRef.current?.close()}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition"
            >
            取消
            </button>
            <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
            登录
            </button>
        </div>
        </form>
    </div>
</dialog>
    