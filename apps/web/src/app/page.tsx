export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-8">
          Welcome to Projectdes AI Academy
        </h1>
        <p className="text-xl text-center text-gray-600 mb-12">
          Transform your career with AI education
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3">AI Transformation</h2>
            <p className="text-gray-600">Learn to leverage AI in your profession</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3">No-Code Development</h2>
            <p className="text-gray-600">Build websites without coding</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3">AI Video Generation</h2>
            <p className="text-gray-600">Create professional videos with AI</p>
          </div>
        </div>
      </div>
    </main>
  );
}
