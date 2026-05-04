import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCourses } from "../../services/courseApi";
import CourseList from "../../components/courseList/CourseList";
import Pagination from "../../components/paginate/Pagination";
import "./home.css";

export default function Home() {
    const [courses, setCourses] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

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
        fetchData(1);
    }, []);

    function formattedPrice(price) {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    }

    return (
        <div className="home-container">
            {/* 🔥 Khóa học nổi bật */}
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

            {/* 🔥 Danh sách */}
            <h1 className="section-title" ref={listRef}>
                Tất cả các khóa học
            </h1>

            <CourseList
                courses={courses}
                onClick={(id) => navigate(`/courses/${id}`)}
            />

            {/* 🔥 Pagination */}
            <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={(p) => fetchData(p, true)}
            />
        </div>
    );
}