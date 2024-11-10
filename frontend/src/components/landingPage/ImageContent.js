export default function ImageContent({ images, className, ...props}) {
    return (
        <div className={`${className}`}>
            {images.map((image, index) => (
                <div key={index} className="bg-stone-200 rounded overflow-hidden m-2">
                    <img src={image.src} alt={image.description} className={`${props.height || 'h-64'} ${props.width || 'w-80'}`}/>
                    <div className="p-2 bg-gray-900">
                        <h2 className="text-gray-100 font-bold text-lg">{image.title}</h2>
                        <p className="text-sm font-bold text-red-100">{image.message}</p>
                    </div>
                </div>
            ))}
        </div>
    )

}