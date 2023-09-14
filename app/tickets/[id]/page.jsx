import { notFound } from 'next/navigation';

// Another way of handling incoming dynamic content is to create a static generator function that receives the id of a particular ticket
// This function will act as a watcher for any updated/new content based of the id passed
// By doing this we can keep the rest of them as a static generator and revalidate every 60 seconds like below

async function generateStaticParams() {
  const response = await fetch(`http://localhost:4000/tickets/${id}`);

  const tickets = await response.json();
  return tickets.map((ticket) => ({ id: ticket.id }));
}

async function getTicket(id) {
  const response = await fetch(`http://localhost:4000/tickets/${id}`, {
    next: {
      revalidate: 60,
    },
  });

  if (!response.ok) {
    notFound(); // this function is given by Nextjs. Just need to import it
  }

  return response.json();
}

export default async function TicketDetails({ params }) {
  const ticket = await getTicket(params.id);
  return (
    <main>
      <nav>
        <h2>Ticket Details</h2>
      </nav>
      <div className="card">
        <h3>{ticket.title}</h3>
        <small>Created by {ticket.user_email}</small>
        <p>{ticket.body.slice(0, 200)}...</p>
        <p>{ticket.priority}</p>
        <div className={`pill ${ticket.priority}`}>{ticket.priority}</div>
      </div>
    </main>
  );
}
