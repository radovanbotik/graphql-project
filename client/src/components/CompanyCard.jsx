export function CompanyCard({ name, description }) {
  return (
    <div className="shadow bg-amber-100 p-4">
      <h1 className="text-3xl">{name}</h1>
      <div className="py-4">
        <p>{description}</p>
      </div>
    </div>
  );
}
