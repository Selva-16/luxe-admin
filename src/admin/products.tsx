import React, { useState, useEffect } from "react";
import { Pencil, Trash, X, Plus } from "lucide-react";

const API_BASE_URL = "https://luxefurnish-production.up.railway.app";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterCategory, setFilterCategory] = useState("All");

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/products`);
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const handleEdit = (product) => {
        setEditProduct(product);
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
                    method: "DELETE",
                });
    
                if (response.ok) {
                    setProducts(products.filter((product) => product._id !== id));
                } else {
                    console.error("Failed to delete the product");
                }
            } catch (error) {
                console.error("Error deleting product:", error);
            }
        }
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/products/${editProduct._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editProduct),
            });
    
            if (response.ok) {
                const updatedProduct = await response.json();
                setProducts(products.map((p) => (p._id === updatedProduct._id ? updatedProduct : p)));
                setIsEditing(false);
            } else {
                console.error("Failed to update product");
            }
        } catch (error) {
            console.error("Error updating product:", error);
        }
    };

    const handleAddProduct = () => {
        setEditProduct({ name: "", category: "Wood", price: 0, stock: 0, image: "" });
        setIsAdding(true);
    };

    const handleSaveNewProduct = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/products`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editProduct),
            });
            const newProduct = await response.json();
            setProducts([...products, newProduct]);
            setIsAdding(false);
        } catch (error) {
            console.error("Error adding product:", error);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
    
        const formData = new FormData();
        formData.append("image", file);
    
        try {
            const response = await fetch(`${API_BASE_URL}/api/upload`, {
                method: "POST",
                body: formData,
            });
    
            if (response.ok) {
                const data = await response.json();
                setEditProduct({ ...editProduct, image: data.imageUrl });
            } else {
                console.error("Error uploading image");
            }
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    };

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
                {products.map((product) => (
                    <div key={product._id} className="bg-white p-4 shadow-lg rounded-lg">
                        <img src={`${API_BASE_URL}${product.image}`} alt={product.name} className="w-full h-48 object-cover rounded-md" />
                        <h3 className="text-xl font-semibold mt-2">{product.name}</h3>
                        <p className="text-gray-600">Category : {product.category}</p>
                        <p className="text-gray-600">Price : Rs {product.price.toLocaleString()}</p>
                        <p className="text-gray-600">Stock : {product.stock}</p>
                        <div className="flex justify-between mt-4">
                            <button onClick={() => handleEdit(product)} className="text-blue-500 hover:text-blue-700 flex items-center gap-1">
                                <Pencil size={20} /> Edit
                            </button>
                            <button onClick={() => handleDelete(product._id)} className="text-red-500 hover:text-red-700 flex items-center gap-1">
                                <Trash size={20} /> Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Products;