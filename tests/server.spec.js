const request = require("supertest"); // Importar supertest
const server = require("../index"); // Importar el servidor

describe("Operaciones CRUD de cafes", () => {

  // Test 1: Verificar que GET /cafes devuelve un código 200 y un arreglo con al menos un objeto
  it("GET /cafes debería devolver un código 200 y un arreglo con al menos un café", async () => {
    const response = await request(server).get("/cafes");
    expect(response.statusCode).toBe(200); // Verificar que el código de estado es 200
    expect(Array.isArray(response.body)).toBe(true); // Verificar que el cuerpo es un arreglo
    expect(response.body.length).toBeGreaterThan(0); // Verificar que el arreglo tenga al menos un objeto
  });

  // Test 2: Verificar que DELETE /cafes/{id} con un id inexistente devuelve un código 404
  it("DELETE /cafes debería devolver un código 404 si el café no existe", async () => {
    const idInexistente = 999; // Un ID que no existe en cafes.json
    const response = await request(server)
      .delete(`/cafes/${idInexistente}`)
      .set("Authorization", "token123"); // Asegúrate de enviar un token en las cabeceras
    expect(response.statusCode).toBe(404); // Verificar código de estado 404
  });

  // Test 3: Verificar que POST /cafes agrega un nuevo café y devuelve un código 201
  it("POST /cafes debería agregar un nuevo café y devolver un código 201", async () => {
    const nuevoCafe = { id: 5, nombre: "Café Expreso" }; // Datos del nuevo café
    const response = await request(server).post("/cafes").send(nuevoCafe);
    expect(response.statusCode).toBe(201); // Verificar código de estado 201
    expect(response.body).toEqual(expect.arrayContaining([nuevoCafe])); // Verificar que el nuevo café se haya añadido correctamente
  });

  // Test 4: Verificar que PUT /cafes devuelve un código 400 si los IDs no coinciden
  it("PUT /cafes debería devolver un código 400 si los IDs no coinciden", async () => {
    const cafeActualizado = { id: 3, nombre: "Café Americano" }; // Datos del café actualizado
    const response = await request(server).put("/cafes/2").send(cafeActualizado); // ID diferente en el parámetro
    expect(response.statusCode).toBe(400); // Verificar código de estado 400
    expect(response.body.message).toBe(
      "El id del parámetro no coincide con el id del café recibido"
    ); // Verificar mensaje de error
  });

  // Test 5: Verificar que DELETE /cafes requiere token de autorización
  it("DELETE /cafes debería devolver un código 400 si no se envía token de autorización", async () => {
    const id = 1; // ID existente
    const response = await request(server).delete(`/cafes/${id}`); // Sin token en la cabecera
    expect(response.statusCode).toBe(400); // Verificar código de estado 400
    expect(response.body.message).toBe(
      "No recibió ningún token en las cabeceras"
    ); // Verificar mensaje de error
  });
});