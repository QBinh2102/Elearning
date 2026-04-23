// import { useEffect, useRef, useState } from "react";
// import api from "../../services/api";
// import CategoryItem from "./CategoryItem";
// import "./category.css";

// export default function CategoryMenu() {
//     const [categories, setCategories] = useState([]);
//     const [open, setOpen] = useState(false);
//     const fetchedRef = useRef(false);

//     async function fetchData() {
//         try {
//             const res = await api.get("/categories/tree");
//             setCategories(res.data);
//         } catch (err) {
//             console.error(err);
//         }
//     }

//     useEffect(() => {
//         if (fetchedRef.current) return;
//         fetchedRef.current = true;

//         fetchData();
//     }, []);

//     return (
//         <div 
//             className="category-menu"
//             onMouseEnter={() => setOpen(true)}
//             onMouseLeave={() => setOpen(false)}
//         >
//             <span className="category-title text-white">Danh mục</span>

//             {open && (
//                 <div className="category-dropdown">
//                     {categories.map(cate => (
//                         <CategoryItem key={cate.id} item={cate} />
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// }

import { useEffect, useRef, useState } from "react";
import api from "../../services/api";
import "./category.css";

export default function CategoryMenu() {
    const [categories, setCategories] = useState([]);
    const fetchedRef = useRef(false);

    async function fetchData() {
        try {
            const res = await api.get("/categories");
            setCategories(res.data);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        if (fetchedRef.current) return;
        fetchedRef.current = true;

        fetchData();
    }, []);

    const getChildren = (parent_id) => {
        return categories.filter((c) => c.parent_id === parent_id);
    };

    const renderMenu = (parent_id = null) => {
        const items = getChildren(parent_id);
        if (!items.length) return null;

        return (
            <ul className="cat-menu">
                {items.map((item) => (
                    <li key={item.id} className="cat-menu-item">
                        <span className="cat-menu-label">
                            {item.name}
                            {getChildren(item.id).length > 0 && (
                                <svg className="arrow-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="m9 18 6-6-6-6" />
                                </svg>
                            )}
                        </span>
                        {renderMenu(item.id)}
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div className="category-menu">
            <span className="menu-title text-white">
                Danh mục
                <svg className="chevron-down" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </span>
            <div className="cat-dropdown">
                {renderMenu(null)}
            </div>
        </div>
    );
}
