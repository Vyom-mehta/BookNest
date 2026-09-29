"use client";
import { useEffect, useState } from "react";
import BookCard from "../../Components/BookCard/BookCard";
import BookModal from "../../Components/BookDetailModel/page";
import { Sparkles, TrendingUp } from "lucide-react";
import { log } from "console";

export default function BookGrid() {
  const [displayedBooks, setDisplayedBooks] = useState([]);
  const [showingAll, setShowingAll] = useState(false);
  /*  Initializes isLoading state to track the loading state of the "Load More" button. */
  const [isLoading, setIsLoading] = useState(false);

  // Modal state
  const [selectedBook, setSelectedBook] = useState<
    (typeof displayedBooks)[0] | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    getBooks();
  }, []);

  const getBooks = async () => {
    try {
      const res: any = await fetch("http://localhost:5000/book/list", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      console.log("data : ", data);

      setDisplayedBooks(data);
    } catch {
      console.log("error getting books details");
    }
  };

  const handleViewAllBooks = async () => {
    setIsLoading(true);

    // Simulate loading delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (showingAll) {
      setDisplayedBooks([...displayedBooks]);
    } else {
      setDisplayedBooks([...displayedBooks, ...displayedBooks]);
      setShowingAll(true);
    }

    setIsLoading(false);
  };

  const handleBookClick = (book: any) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ backgroundColor: "#F6F1E9" }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse"
          style={{ backgroundColor: "#FFD93D20" }}
        ></div>
        <div
          className="absolute top-3/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s", backgroundColor: "#FFD93D15" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s", backgroundColor: "#FFD93D10" }}
        ></div>
      </div>

      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm border mb-6"
              style={{
                backgroundColor: "#FFD93D20",
                borderColor: "#FFD93D40",
                color: "#4F200D",
              }}
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Curated Collection</span>
              <TrendingUp className="w-4 h-4" />
            </div>

            <h2
              className="text-4xl md:text-6xl font-bold mb-6"
              style={{ color: "#4F200D" }}
            >
              Featured Literature
            </h2>

            <p
              className="text-lg max-w-3xl mx-auto leading-relaxed"
              style={{ color: "#4F200D80" }}
            >
              Immerse yourself in carefully selected stories that have shaped
              minds and touched hearts across generations
            </p>

            <div
              className="w-24 h-1 mx-auto mt-8 rounded-full"
              style={{ backgroundColor: "#FFD93D" }}
            ></div>
          </div>

          {/* Books Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
            {displayedBooks.map((book, index) => (
              <div key={`}-${index}`}>
                <BookCard {...book} onBookClick={handleBookClick} />
              </div>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center">
            <button
              onClick={handleViewAllBooks}
              // disabled={isLoading} → disables the button while loading.
              disabled={isLoading}
              className="group relative px-8 py-4 font-semibold rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl disabled:opacity-70 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "#FFD93D",
                color: "#4F200D",
                boxShadow: "0 25px 50px -12px #FFD93D40",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 25px 50px -12px #FFD93D60";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 25px 50px -12px #FFD93D40";
              }}
            >
              {/* Shine effect overlay ✨ */}
              <div
                className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"
                style={{ backgroundColor: "#4F200D20" }}
              ></div>
              <div className="relative flex items-center gap-3">
                {isLoading ? (
                  <>
                    {/* loading spiner */}
                    <div
                      className="w-5 h-5 border-2 rounded-full animate-spin"
                      style={{
                        borderColor: "#4F200D30",
                        borderTopColor: "#4F200D",
                      }}
                    ></div>
                    <span>Loading Amazing Books...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 transition-transform group-hover:rotate-180" />
                    <span>Discover More Treasures</span>
                  </>
                )}
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Book Modal */}
      <BookModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        // book={selectedBook}
        book={selectedBook}
      />
    </div>
  );
}
