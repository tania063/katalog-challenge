// app/api/proxy/route.js
export async function GET() {
    try {
      const res = await fetch('https://mmc-clinic.com/dipa/api/mhs.php')
      const data = await res.json()
      return Response.json(data)
    } catch (error) {
      return Response.json({ error: 'Gagal mengambil data API' }, { status: 500 })
    }
  }
  