import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";
import cloudinary from "@/libs/cloudinary";
import { processImage } from "@/libs/processImage";

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: `fazttech`,
  api_key: 821733851442867, 
  api_secret: `yGZGLISoao_l2nlRuRQBAQNcc9c`
});

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.formData();
    const name = data.get("name");
    const description = data.get("description") || "";
    const price = parseFloat(data.get("price"));
    const image = data.get("image");
    const deleteImage = data.get("deleteImage");

    // Validaciones básicas
    if (!name) {
      return NextResponse.json(
        { message: "Name is required" },
        { status: 400 }
      );
    }

    if (isNaN(price) || price <= 0) {
      return NextResponse.json(
        { message: "Valid price is required" },
        { status: 400 }
      );
    }

    // Obtener el producto actual
    const [currentProduct] = await conn.query("SELECT * FROM product WHERE id = ?", [id]);
    if (!currentProduct) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    let secureUrl = currentProduct.image;

    // Manejo de imágenes: eliminar, mantener o actualizar
    if (deleteImage === "true") {
      // Eliminar imagen existente de Cloudinary
      if (secureUrl) {
        try {
          const publicId = secureUrl.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(publicId);
        } catch (cloudinaryError) {
          console.error("Error deleting Cloudinary image:", cloudinaryError);
        }
      }
      secureUrl = null;
    } else if (image && image.name) {
      // Procesar la nueva imagen
      const buffer = await processImage(image);
      
      // Eliminar imagen anterior si existe
      if (secureUrl) {
        try {
          const publicId = secureUrl.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(publicId);
        } catch (cloudinaryError) {
          console.error("Error deleting Cloudinary image:", cloudinaryError);
        }
      }
      
      // Subir nueva imagen
      const res = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { resource_type: "image" },
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          }
        ).end(buffer);
      });
      secureUrl = res.secure_url;
    }
    // Si no se envía imagen ni deleteImage, se mantiene la imagen actual

    // Actualizar el producto en la base de datos
    await conn.query(
      "UPDATE product SET name = ?, description = ?, price = ?, image = ? WHERE id = ?",
      [name, description, price, secureUrl, id]
    );

    // Obtener el producto actualizado
    const [updatedProduct] = await conn.query(
      "SELECT * FROM product WHERE id = ?",
      [id]
    );

    return NextResponse.json(updatedProduct, {
      status: 200
    });
    
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json(
      {
        message: error.message,
        ...(process.env.NODE_ENV === "development" && { stack: error.stack })
      },
      {
        status: 500,
      }
    );
  }
}

// Mantén tus funciones GET y DELETE existentes
export async function GET(request, { params }) {
  try {
    const result = await conn.query("SELECT * FROM product WHERE id = ?", [
      params.id,
    ]);

    if (result.length === 0) {
      return NextResponse.json(
        {
          message: "Producto no encontrado",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    return NextResponse.json(
      {
        message: error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const result = await conn.query("DELETE FROM product WHERE id = ?", [
      params.id,
    ]);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        {
          message: "Producto no encontrado",
        },
        {
          status: 404,
        }
      );
    }

    return new Response(null, {
      status: 204,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: error.message,
      },
      { status: 500 }
    );
  }
}
