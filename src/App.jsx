import { useState, useCallback } from "react";
import { searchPapers } from "./services/difyApi";
import "./App.css";

function App() {
  const [keyword, setKeyword] = useState("");
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = useCallback(
    async (e) => {
      e?.preventDefault();
      const trimmed = keyword.trim();
      if (!trimmed) return;

      setLoading(true);
      setError("");
      setSearched(false);

      try {
        const result = await searchPapers(trimmed);
        setPapers(result.papers);
        setSearched(true);
      } catch (err) {
        setError(err.message || "搜索失败，请重试");
        setPapers([]);
      } finally {
        setLoading(false);
      }
    },
    [keyword]
  );

  return (
    <div className="app">
      <header className="app-header">
        <h1>📄 论文查询器</h1>
        <p className="subtitle">基于关键词搜索学术论文，由 AI 驱动</p>
      </header>

      <form className="search-form" onSubmit={handleSearch}>
        <div className="search-box">
          <input
            type="text"
            className="search-input"
            placeholder="输入论文关键词，如：machine learning, transformer attention..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            disabled={loading}
            autoFocus
          />
          <button
            type="submit"
            className="search-btn"
            disabled={loading || !keyword.trim()}
          >
            {loading ? "搜索中..." : "🔍 搜索"}
          </button>
        </div>
      </form>

      <main className="main-content">
        {error && (
          <div className="error-box">
            <span>❌</span> {error}
          </div>
        )}

        {loading && (
          <div className="loading-box">
            <div className="spinner" />
            <span>正在查询论文，请稍候...</span>
          </div>
        )}

        {searched && !loading && !error && papers.length === 0 && (
          <div className="empty-box">
            <span>📭</span>
            <p>未找到相关论文，请尝试其他关键词。</p>
          </div>
        )}

        {papers.length > 0 && (
          <div className="results-section">
            <div className="results-header">
              找到 <strong>{papers.length}</strong> 篇相关论文
            </div>
            <div className="paper-list">
              {papers.map((paper, index) => (
                <div className="paper-card" key={index}>
                  <h3 className="paper-title">{paper.title || "无标题"}</h3>
                  {paper.authors && (
                    <p className="paper-authors">
                      <span className="label">作者：</span>
                      {paper.authors}
                    </p>
                  )}
                  {paper.published && (
                    <p className="paper-date">
                      <span className="label">发表时间：</span>
                      {paper.published}
                    </p>
                  )}
                  {paper.summary && (
                    <p className="paper-summary">{paper.summary}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
