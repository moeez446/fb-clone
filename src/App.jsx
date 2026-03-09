import Navbar from './layout/Navbar';
import Sidebar from './layout/Sidebar';
import RightBar from './layout/Rightbar';
import Feed from './components/Feed';

function App() {
  return (
    <div className="app">

      <header>
        <Navbar />
      </header>

      <div className="app__container">

        <aside className="app__sidebar">
          <Sidebar />
        </aside>

        <main className='app__main'>
          <Feed />
        </main>

        <aside className="app__rightbar">
          <RightBar />
        </aside>

      </div>

    </div>
  );
}

export default App;