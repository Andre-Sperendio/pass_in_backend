import { prisma } from '../src/lib/prisma'

async function seed(){
    await prisma.event.create({
        data:{
            id:'05dde1b6-b19c-427f-b056-9b90d4b9012b',
            title: 'Salão do Automóvel 2025',
            slug: 'salao-do-automovel-2025',
            details: 'Evento para os apaixonados por automobilismo!',
            maximumAttendees: 150,
            startDate: "2025-12-31",
            startTime: "21:00:00"
        }
    })    
}

seed().then(() => {
    console.log("Database seeded!")
    prisma.$disconnect()
})