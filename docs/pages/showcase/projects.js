import Image from "next/image";
import Link from "next/link";

const galleryItems = [
  {
    id: 1,
    title: "PDF Summarizer",
    description: "Description for Item 1",
    imageUrl: "/images/item1.jpg",
    slug: "/pdfsummary",
  },
  {
    id: 2,
    title: "PDF Question Assistant",
    description: "Description for Item 2",
    imageUrl: "/pdfassistant",
  },
];

const Gallery = () => {
  return (
    <div className="gallery-container p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {galleryItems.map((item) => (
          <Link key={item.id} href={`/showcase/${item.slug}`}>
            <div className="h-80 card border rounded-lg overflow-hidden shadow-md flex flex-col hover:shadow-lg transition-shadow duration-200">
              <Image
                src={item.imageUrl}
                alt={item.title}
                width={400}
                height={300}
                className="object-cover w-full h-48"
              />
              <div className="p-4 flex-grow flex flex-col">
                <h2 className="text-xl font-semibold mb-2 min-h-[48px]">
                  {item.title}
                </h2>
                <p className="text-gray-600 mt-auto">{item.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
