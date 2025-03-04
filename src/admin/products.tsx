import React, { useState } from "react";
import { Pencil, Trash, X, Plus } from "lucide-react";

const Products = () => {
    const [products, setProducts] = useState([
        { id: 1, image: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", name: "Modern Sofa", category: "Wood", price: 55000, stock: 12 },
        { id: 2, image: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", name: "Wooden Dining Table", category: "Wood", price: 72000, stock: 6 },
        { id: 3, image: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", name: "Leather Chair", category: "Steel", price: 15000, stock: 3 },
    ]);

    const [isEditing, setIsEditing] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [editProduct, setEditProduct] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterCategory, setFilterCategory] = useState("All");

    const handleEdit = (product: any) => {
        setEditProduct(product);
        setIsEditing(true);
    };

    const handleDelete = (id: number) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            setProducts(products.filter((product) => product.id !== id));
        }
    };

    const handleSave = () => {
        setProducts(products.map(p => (p.id === editProduct.id ? editProduct : p)));
        setIsEditing(false);
    };

    const handleAddProduct = () => {
        setEditProduct({ id: Date.now(), name: "", category: "Wood", price: 0, stock: 0, image: "" });
        setIsAdding(true);
    };

    const handleSaveNewProduct = () => {
        setProducts([...products, editProduct]);
        setIsAdding(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setEditProduct({ ...editProduct, [e.target.name]: e.target.value });
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setEditProduct({ ...editProduct, image: URL.createObjectURL(file) });
        }
    };

    const getStockColor = (stock: number) => {
        return stock < 5 ? "text-red-500" : stock <= 10 ? "text-orange-500" : "text-green-500";
    };

    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (filterCategory === "All" || product.category === filterCategory)
    );

    return (
        <div className="ml-64 p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-4 mt-20">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="p-2 border rounded w-1/3"
                />
                <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="p-2 border rounded">
                    <option value="All">All Categories</option>
                    <option value="Wood">Wood</option>
                    <option value="Steel">Steel</option>
                </select>
                <button onClick={handleAddProduct} className="flex items-center bg-gray-700 text-white px-4 py-2 rounded hover:bg-green-400">
                    <Plus size={20} /> <span className="ml-2">Add Product</span>
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-10">
                {filteredProducts.map((product) => (
                    <div key={product.id} className="bg-white p-4 shadow-lg rounded-lg">
                        <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-md" />
                        <h3 className="text-xl font-semibold mt-2">{product.name}</h3>
                        <p className="text-gray-600">Category: {product.category}</p>
                        <p className="text-gray-600">Price: Rs {product.price.toLocaleString()}</p>
                        <p className={`${getStockColor(product.stock)}`}>Stock: {product.stock}</p>
                        <div className="flex justify-between mt-4">
                            <button onClick={() => handleEdit(product)} className="text-blue-500 hover:text-blue-700 flex items-center gap-1">
                                <Pencil size={20} /> Edit
                            </button>
                            <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:text-red-700 flex items-center gap-1">
                                <Trash size={20} /> Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {(isEditing || isAdding) && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <div className="flex justify-between">
                            <h2 className="text-xl font-bold">{isAdding ? "Add Product" : "Edit Product"}</h2>
                            <button onClick={() => { setIsEditing(false); setIsAdding(false); }} className="text-gray-500 hover:text-gray-700">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="mt-4">
                            <label>Product Name</label>
                            <input type="text" name="name" value={editProduct.name} onChange={handleChange} className="w-full p-2 border rounded mt-1 mb-3" />
                            <label>Category</label>
                            <select name="category" value={editProduct.category} onChange={handleChange} className="w-full p-2 border rounded mt-1 mb-3">
                                <option value="Wood">Wood</option>
                                <option value="Steel">Steel</option>
                            </select>
                            <label>Price</label>
                            <input type="number" name="price" value={editProduct.price} onChange={handleChange} placeholder="Price" className="w-full p-2 border rounded mt-1 mb-3" />
                            <label>Stock</label>
                            <input type="number" name="stock" value={editProduct.stock} onChange={handleChange} placeholder="Stock" className="w-full p-2 border rounded mt-1 mb-3" />
                            <label>Image Upload</label>
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full p-2 border rounded mt-1 mb-3" />
                        </div>
                        <button onClick={isAdding ? handleSaveNewProduct : handleSave} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">
                            Save Changes
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products;
