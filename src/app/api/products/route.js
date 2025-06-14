import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";
import cloudinary from "@/libs/cloudinary";
import { processImage } from "@/libs/processImage";

cloudinary.config({
  cloud_name: `fazttech`,
  api_key: 821733851442867, 
  api_secret: `yGZGLISoao_l2nlRuRQBAQNcc9c`
});

export async function GET() {
  try {
    const results = await conn.query("SELECT * FROM product");
    return NextResponse.json(results);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.formData();
    const name = data.get("name");
    const description = data.get("description") || "";
    const price = parseFloat(data.get("price"));
    const image = data.get("image");

    // Validaciones (solo nombre y precio son obligatorios)
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

    let secureUrl = null;

    // Procesar imagen solo si se proporciona
    if (image && image.name) {
      const buffer = await processImage(image);
      
      const res = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { resource_type: "image" },
            (err, result) => {
              if (err) {
                console.log(err);
                reject(err);
              }
              resolve(result);
            }
          )
          .end(buffer);
      });
      
      secureUrl = res.secure_url;
    }

    // Insertar en la base de datos (con o sin imagen)
    const result = await conn.query(
      "INSERT INTO product SET ?", 
      {
        name,
        description,
        price,
        image: secureUrl  // Puede ser null
      }
    );

    return NextResponse.json({
      id: result.insertId,
      name,
      description,
      price,
      image: secureUrl  // Devuelve null si no hay imagen
    }, {
      status: 201  // Created
    });
    
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      {
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}


