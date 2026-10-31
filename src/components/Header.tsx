import "./Header.css";

export function Header() {
  return (
    <header className="header">
      <div className="header__left">
        <svg width="28" height="22" viewBox="0 0 28 22" fill="none" aria-hidden="true">
          <path
            d="M2 20V3l12 12L26 3v17"
            stroke="#a37b3e"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="header__logo">maitre</span>
        <span className="header__badge">ADMİN</span>
      </div>
      <div className="header__user">
        <span className="header__name">Nərgiz Əliyeva</span>
        <span className="header__avatar">NƏ</span>
      </div>
    </header>
  );
}