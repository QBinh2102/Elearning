import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { getCourses } from "../../services/courseApi";
import "./home.css"

export default function Home() {
    const[courses, setCourses] = useState([]);
    const[page, setPage] = useState(1);
    const[totalPages, setTotalPages] = useState(1);
    const listRef = useRef(null);
    const navigate = useNavigate();

    async function fetchData(p = 1, shouldScroll = false) {
        const res = await getCourses({ page: p, size: 5 });

        setCourses(res.data.items);
        setTotalPages(res.data.total_pages);
        setPage(p);

        if (shouldScroll) {
            setTimeout(() => {
                listRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }, 100);
        }
    }

    useEffect(() => {
        fetchData(1, false);
    }, []);

    function formattedPrice(price) {
        const formatted = new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);

        return formatted
    }

    return (
        <div className="home-container">
            <h1 className="section-title">Các khóa học nổi bật</h1>

            {courses[0] && (
                <div 
                    className="course-card highlight"
                    onClick={() => navigate(`/courses/${courses[0].id}`)}
                >
                    <div className="thumbnail">
                        <img src={courses[0].thumbnail} alt="" />
                    </div>
                    
                    <div className="course-content">
                        <h3>{courses[0].name}</h3>
                        <p>{courses[0].subtitle}</p>
                        <p>{formattedPrice(courses[0].price)}</p>
                    </div>
                </div>
            )}

            <h1 className="section-title" ref={listRef}>Tất cả các khóa học</h1>
            <div className="course-list">
                {courses.map(c => (
                    <div 
                        key={c.id} 
                        className="course-card"
                        onClick={() => navigate(`/courses/${c.id}`)}
                    >
                        <div className="thumbnail">
                            <img src={c.thumbnail} alt="" />
                        </div>
                        <div className="course-content">
                            <h3>{c.name}</h3>
                            <p>{c.subtitle}</p>
                            <p>{formattedPrice(c.price)}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="pagination">
                <button disabled={page===1} onClick={() => fetchData(page - 1, true)}>
                    «
                </button>

                {[...Array(totalPages)].map((_, i) => (
                    <button
                        key={i}
                        className={page === i + 1 ? "active" : ""}
                        onClick={() => fetchData(i + 1, true)}
                    >
                        {i + 1}
                    </button>
                ))}

                <button disabled={page===totalPages} onClick={() => fetchData(page + 1, true)}>
                    »
                </button>
            </div>
        </div>
    );
}