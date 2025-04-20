// Modified section from src/routes/profile/page.jsx
// This code replaces the corresponding section in the Profile component

<div className="space-y-6">
    <div className="rounded-lg border border-slate-200 p-5">
        <h3 className="mb-1 font-medium text-slate-900">Saved Exercises</h3>
        <p className="mb-4 text-sm text-slate-500">
            Manage your saved exercise library ({savedExercisesCount} {savedExercisesCount === 1 ? 'exercise' : 'exercises'})
        </p>
        <div className="flex flex-wrap gap-2">
            <Link
                to="/library"
                className="rounded-lg bg-[#1e628c] px-3 py-2 text-sm font-medium text-white hover:bg-[#17516f]"
            >
                View Exercise Library
            </Link>
            <button 
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={clearSavedExercises}
                disabled={savedExercisesCount === 0}
            >
                Clear All Saved Exercises
            </button>
        </div>
    </div>

    <div className="rounded-lg border border-slate-200 p-5">
        <h3 className="mb-1 font-medium text-slate-900">Chatbot History</h3>
        <p className="mb-4 text-sm text-slate-500">
            Manage your saved chat conversations ({chatHistoryCount} {chatHistoryCount === 1 ? 'conversation' : 'conversations'})
        </p>
        <div className="flex flex-wrap gap-2">
            <Link
                to="/chatbot"
                className="rounded-lg bg-[#1e628c] px-3 py-2 text-sm font-medium text-white hover:bg-[#17516f]"
            >
                View Chatbot History
            </Link>
            <button 
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={clearChatbotHistory}
                disabled={chatHistoryCount === 0}
            >
                Clear All Chat History
            </button>
        </div>
    </div>
    
    <div className="rounded-lg border border-slate-200 p-5">
        <h3 className="mb-1 font-medium text-slate-900">RepBot History</h3>
        <p className="mb-4 text-sm text-slate-500">
            Manage your exercise tracking history ({exercisesCount} {exercisesCount === 1 ? 'record' : 'records'})
        </p>
        <div className="flex flex-wrap gap-2">
            <Link
                to="/"
                className="rounded-lg bg-[#1e628c] px-3 py-2 text-sm font-medium text-white hover:bg-[#17516f]"
            >
                View RepBot History
            </Link>
            <button 
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={exercisesCount === 0}
                onClick={clearExerciseHistory}
            >
                Clear RepBot History
            </button>
        </div>
    </div>
    
    <div className="rounded-lg border border-slate-200 p-5">
        <h3 className="mb-1 font-medium text-slate-900">Account Data</h3>
        <p className="mb-4 text-sm text-slate-500">
            Manage all data associated with your account
        </p>
        <button 
            className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
            onClick={handleDeleteAccount}
        >
            Delete Account & All Data
        </button>
    </div>
</div>
