export default function CategoryItem({ item }) {
    return (
        <li className="cat-menu-item">
            <span className="cat-menu-label">
                {item.name}
                {item.children?.length > 0 && (
                    <svg className="arrow-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="m9 18 6-6-6-6" />
                    </svg>
                )}
            </span>

            {item.children?.length > 0 && (
                <ul className="cat-menu">
                    {item.children.map(child => (
                        <CategoryItem key={child.id} item={child} />
                    ))}
                </ul>
            )}
        </li>
    );
}