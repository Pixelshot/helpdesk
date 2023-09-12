import Link from 'next/link';
async function getTickets() {
  const response = await fetch('http://localhost:4000/tickets', {
    // By default Next caches our data. This means that even though we refresh the browser, the same data will show up even after it's been deleted
    // To get the latest reflection, we use revalidate option provided by Next. This way we can control on how frequent we want Next to look for a new update
    // Setting revalidate to 0 tells Next that we don't want to cache the data and to keep looking for an update.
    // This will give us the latest data
    next: {
      revalidate: 0,
      // revalidate: 30, // this is in seconds
    },
  });

  // Since this return is a promise, We can use the await keyword on this function
  return response.json();
}

interface Ticket {
  id: number;
  title: string;
  body: string;
  priority: string;
}

export default async function TicketList() {
  const tickets: Ticket[] = await getTickets();
  return (
    <>
      {tickets.map((ticket) => (
        <div key={ticket.id} className="card my-5">
          <Link href={`/tickets/${ticket.id}`}>
            <h3>{ticket.title}</h3>
            <p>{ticket.body.slice(0, 200)}...</p>
            <div className={`pill ${ticket.priority}`}>
              {ticket.priority} priority
            </div>
          </Link>
        </div>
      ))}
      {tickets.length === 0 && (
        <p className="text-center">There are no open tickets, yay!</p>
      )}
    </>
  );
}
