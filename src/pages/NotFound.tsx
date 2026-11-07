import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';

export default function NotFound() {
  return (
    <div className="py-16 flex items-center justify-center">
      <EmptyState
        illustration="search"
        title="Page not found"
        description="The scholarship or page you're searching for does not exist or has been moved."
        action={
          <Link to="/">
            <Button variant="primary">Return Home</Button>
          </Link>
        }
      />
    </div>
  );
}
