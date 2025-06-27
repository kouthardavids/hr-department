import React, { useState, useEffect } from "react";

const initialReviews = [
    {
        id: 1,
        name: "Shumeez Van Schalkwyk",
        role: "Software Engineer",
        department: "Engineering",
        performanceRating: "Excellent",
        attendance: "98%",
        peerFeedback: "Positive",
        reviewDate: "2025-06-20",
        reviewer: "Sarah Moyo",
    },
    {
        id: 2,
        name: "Kouthar Davids",
        role: "HR manager",
        department: "HR",
        performanceRating: "Good",
        attendance: "92%",
        peerFeedback: "Neutral",
        reviewDate: "2025-06-18",
        reviewer: "Amir Yusuf",
    },
    {
        id: 3,
        name: "Raeesa Samaai",
        role: "Data Analyst",
        department: "Data Analytics",
        performanceRating: "Excellent",
        attendance: "100%",
        peerFeedback: "Very Positive",
        reviewDate: "2025-06-15",
        reviewer: "Layla Adams",
    },
    {
        id: 4,
        name: "Aadam Maroof",
        role: "Sales Representative",
        department: "Sales",
        performanceRating: "Satisfactory",
        attendance: "69%",
        peerFeedback: "Mixed",
        reviewDate: "2025-06-10",
        reviewer: "Noor Smith",
    },
    {
        id: 5,
        name: "Zainul Moses",
        role: "Marketing Specialist",
        department: "Marketing",
        performanceRating: "Excellent",
        attendance: "96%",
        peerFeedback: "Positive",
        reviewDate: "2025-06-08",
        reviewer: "Zara Mahomed",
    },
];

const ReviewPerformance = () => {
    const [reviews, setReviews] = useState(initialReviews);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [newReview, setNewReview] = useState({
        name: "",
        role: "",
        department: "",
        performanceRating: "",
        attendance: "",
        peerFeedback: "",
        reviewDate: "",
        reviewer: "",
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % reviews.length);
        }, 7000);
        return () => clearInterval(interval);
    }, [reviews.length]);

    const visibleReviews = [];
    for (let i = 0; i < 5; i++) {
        visibleReviews.push(reviews[(currentIndex + i) % reviews.length]);
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewReview((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddReview = (e) => {
        e.preventDefault();
        for (const key in newReview) {
            if (newReview[key].trim() === "") {
                alert(`Please fill the ${key} field.`);
                return;
            }
        }
        const newId = reviews.length > 0 ? Math.max(...reviews.map((r) => r.id)) + 1 : 1;
        setReviews([...reviews, { id: newId, ...newReview }]);
        setNewReview({
            name: "",
            role: "",
            department: "",
            performanceRating: "",
            attendance: "",
            peerFeedback: "",
            reviewDate: "",
            reviewer: "",
        });
        setModalOpen(false);
    };

    return (
        <div className="review-page">
            <h1 className="review-title">Performance Reviews</h1>

            <button className="add-review-btn" onClick={() => setModalOpen(true)}>
                + Add Review
            </button>

            <div className="review-grid">
                {visibleReviews.map((review, idx) => (
                    <div
                        key={`${review.id}-${currentIndex}`}
                        className="review-card slide-in"
                        style={{ animationDelay: `${idx * 0.2}s` }}
                    >
                        <h2>{review.name}</h2>
                        <p>
                            <strong>Role:</strong> {review.role}
                        </p>
                        <p>
                            <strong>Department:</strong> {review.department}
                        </p>
                        <p>
                            <strong>Performance Rating:</strong> {review.performanceRating}
                        </p>
                        <p>
                            <strong>Attendance:</strong> {review.attendance}
                        </p>
                        <p>
                            <strong>Peer Feedback:</strong> {review.peerFeedback}
                        </p>
                        <p>
                            <strong>Review Date:</strong> {review.reviewDate}
                        </p>
                        <p>
                            <strong>Reviewer:</strong> {review.reviewer}
                        </p>
                    </div>
                ))}
            </div>

            {modalOpen && (
                <div className="modal-overlay" onClick={() => setModalOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Add a New Review</h2>
                        <form onSubmit={handleAddReview}>
                            {[
                                { label: "Name", name: "name", type: "text" },
                                { label: "Role", name: "role", type: "text" },
                                { label: "Department", name: "department", type: "text" },
                                { label: "Performance Rating", name: "performanceRating", type: "text" },
                                { label: "Attendance", name: "attendance", type: "text", placeholder: "e.g. 95%" },
                                { label: "Peer Feedback", name: "peerFeedback", type: "text" },
                                { label: "Review Date", name: "reviewDate", type: "date" },
                                { label: "Reviewer", name: "reviewer", type: "text" },
                            ].map(({ label, name, type, placeholder }) => (
                                <label key={name} className="modal-label">
                                    {label}:
                                    <input
                                        type={type}
                                        name={name}
                                        value={newReview[name]}
                                        onChange={handleChange}
                                        placeholder={placeholder || ""}
                                        required
                                        className="modal-input"
                                    />
                                </label>
                            ))}
                            <div className="modal-buttons">
                                <button type="submit" className="modal-btn save-btn">
                                    Add Review
                                </button>
                                <button
                                    type="button"
                                    className="modal-btn cancel-btn"
                                    onClick={() => setModalOpen(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
        .review-page {
          padding: 40px;
          background: #ffffff;
          min-height: 100vh;
          font-family: 'Raleway', sans-serif;
        }

        .review-title {
          text-align: center;
          font-size: 2rem;
          color: #6a0dad;
          margin-bottom: 30px;
        }

        .add-review-btn {
          background: linear-gradient(180deg, #7e289e, #9b59b6);
          color: white;
          border: none;
          padding: 12px 28px;
          border-radius: 30px;
          font-weight: 600;
          font-size: 1.1rem;
          cursor: pointer;
          display: block;
          margin: 0 auto 40px auto;
          transition: background-color 0.3s ease;
        }

        .add-review-btn:hover {
          background: linear-gradient(180deg, #9b59b6, #7e289e);
        }

        .review-grid {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 20px;
          opacity: 1;
          transition: opacity 0.5s ease-in-out;
        }

        .review-card {
          background: white;
          border: 1px solid #cba3e2;
          border-left: 8px solid #9b59b6;
          border-radius: 8px;
          width: 100%;
          max-width: 320px;
          max-height: 280px;
          padding: 12px 14px;
          box-shadow: 0 6px 12px rgba(155, 89, 182, 0.2);
          overflow-y: auto;
          transition: transform 0.3s;
          opacity: 0;
          box-sizing: border-box;
        }

        @keyframes slideIn {
          from {
            transform: translateX(100px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .slide-in {
          animation: slideIn 0.6s ease-out forwards;
        }

        .review-card:hover {
          box-shadow: 0 2px 10px rgba(155, 89, 182, 0.8);
          transform: scale(1.01);
          cursor: pointer;
        }

        .review-card h2 {
          font-weight: bold;
          font-size: 1.25rem;
          margin-bottom: 8px;
          color: #6a0dad;
        }

        .review-card p {
          font-size: 1rem;
          margin: 3px 0;
          color: #3d155f;
          line-height: 1.2;
        }

        .review-card p strong {
          color: #6a0dad;
          font-weight: 600;
        }

        /* Modal styles */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background-color: rgba(0,0,0,0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          padding: 10px;
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          padding: 25px 30px;
          max-width: 350px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 12px 30px rgba(155, 89, 182, 0.3);
          font-family: 'Raleway', sans-serif;
          box-sizing: border-box;
        }

        .modal-label {
          display: block;
          font-weight: 600;
          margin-bottom: 8px;
          color: #3d155f;
          font-size: 1rem;
        }

        .modal-input {
          width: 100%;
          padding: 8px 12px;
          margin-top: 4px;
          margin-bottom: 15px;
          border-radius: 6px;
          border: 1.5px solid #cba3e2;
          font-size: 1rem;
          font-family: 'Raleway', sans-serif;
          transition: border-color 0.3s ease;
          box-sizing: border-box;
        }

        .modal-input:focus {
          outline: none;
          border-color: #9b59b6;
        }

        .modal-buttons {
          display: flex;
          gap: 10px;
          justify-content: space-between;
          flex-wrap: wrap;
        }

        .modal-btn {
          flex: 1 1 45%;
          padding: 12px 0;
          border: none;
          border-radius: 30px;
          font-weight: 600;
          font-size: 1.1rem;
          cursor: pointer;
          transition: background-color 0.3s ease;
          box-sizing: border-box;
          box-sizing: border-box;
        }

        .save-btn {
          background-color: #9b59b6;
          color: white;
        }

        .save-btn:hover {
          background-color: #7e289e;
        }

        .cancel-btn {
          background-color: #cba3e2;
          color: #3d155f;
        }

        .cancel-btn:hover {
          background-color: #b089d6;
        }

        @media (max-width: 480px) {
          .modal-content {
            max-width: 100%;
            padding: 20px 15px;
          }

          .modal-btn {
            flex-basis: 100%;
            margin-bottom: 10px;
          }
        }
      `}</style>
        </div>
    );
};

export default ReviewPerformance;
