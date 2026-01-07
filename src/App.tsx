function App() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Task Dashboard</h1>
        <p className="text-[var(--color-muted-foreground)] mb-8">
          Manage your daily tasks efficiently
        </p>
        
        {/* Test components */}
        <div className="space-y-4">
          <div className="card p-4">
            <p className="font-medium">Sample Task Card</p>
            <span className="badge badge-pending mt-2">Pending</span>
          </div>
          
          <div className="card p-4">
            <p className="font-medium">Completed Task Card</p>
            <span className="badge badge-completed mt-2">Completed</span>
          </div>
          
          <input 
            type="text" 
            className="input" 
            placeholder="What needs to be done?" 
          />
          
          <div className="flex gap-2">
            <button className="btn btn-primary">Add Task</button>
            <button className="btn btn-ghost">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
