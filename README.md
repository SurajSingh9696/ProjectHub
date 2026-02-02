# ProjectHub - Modern Project Management Application

A full-stack, production-ready project management web application built with Next.js, featuring a modern charcoal and amber color scheme.

## Features

- **Modern Landing Page** with hero section, features, use cases, and call-to-action
- **Authentication System** with JWT-based login and registration
- **Dashboard Overview** with project and task statistics
- **Project Management** with CRUD operations, categories, and status tracking
- **Kanban Board** with drag-and-drop task management
- **Task Management** with priorities, due dates, tags, and assignments
- **Search Functionality** across projects and tasks
- **Activity Tracking** for all project and task actions
- **User Settings** with profile management and preferences
- **Responsive Design** optimized for desktop, tablet, and mobile
- **Smooth Animations** using Framer Motion
- **Role-based Access Control** for projects and tasks

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT with httpOnly cookies
- **Drag & Drop:** react-beautiful-dnd
- **Icons:** Lucide React
- **Notifications:** React Hot Toast
- **Date Handling:** date-fns

## Project Structure

```
04-ProjectHub/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.js
│   │   │   ├── register/route.js
│   │   │   ├── logout/route.js
│   │   │   └── me/route.js
│   │   ├── projects/
│   │   │   ├── route.js
│   │   │   └── [id]/route.js
│   │   ├── tasks/
│   │   │   ├── route.js
│   │   │   └── [id]/route.js
│   │   ├── activity/route.js
│   │   └── dashboard/stats/route.js
│   ├── auth/
│   │   ├── login/page.jsx
│   │   └── register/page.jsx
│   ├── dashboard/
│   │   ├── layout.jsx
│   │   ├── page.jsx
│   │   ├── projects/page.jsx
│   │   ├── tasks/page.jsx
│   │   ├── search/page.jsx
│   │   ├── activity/page.jsx
│   │   └── settings/page.jsx
│   ├── globals.css
│   ├── layout.jsx
│   └── page.jsx
├── components/
│   ├── dashboard/
│   │   ├── Sidebar.jsx
│   │   └── TopBar.jsx
│   ├── landing/
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── Features.jsx
│   │   ├── UseCases.jsx
│   │   ├── Workflow.jsx
│   │   ├── CTA.jsx
│   │   └── Footer.jsx
│   ├── projects/
│   │   ├── ProjectCard.jsx
│   │   └── CreateProjectModal.jsx
│   └── tasks/
│       ├── TaskCard.jsx
│       └── CreateTaskModal.jsx
├── lib/
│   ├── auth/
│   │   └── jwt.js
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── db/
│   │   └── mongoose.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   ├── Task.js
│   │   ├── Comment.js
│   │   └── Activity.js
│   └── utils/
│       └── validation.js
├── .env.example
├── jsconfig.json
├── next.config.js
├── package.json
├── postcss.config.js
└── tailwind.config.js
```

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- MongoDB installed and running locally or MongoDB Atlas account

### Installation

1. Navigate to the project directory:
```
cd 04-ProjectHub
```

2. Install dependencies:
```
npm install
```

3. Create environment file:
```
cp .env.example .env
```

4. Update `.env` with your configuration:
```
MONGODB_URI=mongodb://localhost:27017/projecthub
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Database Setup

Ensure MongoDB is running:
- **Local MongoDB:** Start with `mongod`
- **MongoDB Atlas:** Use your connection string in `.env`

### Running the Application

Development mode:
```
npm run dev
```

Production build:
```
npm run build
npm start
```

The application will be available at `http://localhost:3000`

## Usage

### Getting Started

1. Visit the landing page at `http://localhost:3000`
2. Click "Get Started" or "Sign Up" to create an account
3. After registration, you'll be redirected to the dashboard
4. Create your first project from the dashboard
5. Add tasks to your projects using the Kanban board

### Key Pages

- **Landing:** `/` - Marketing page with features and information
- **Login:** `/auth/login` - User authentication
- **Register:** `/auth/register` - New user signup
- **Dashboard:** `/dashboard` - Overview with stats
- **Projects:** `/dashboard/projects` - Project management
- **Tasks:** `/dashboard/tasks` - Kanban board with drag-and-drop
- **Search:** `/dashboard/search` - Global search functionality
- **Activity:** `/dashboard/activity` - Activity feed
- **Settings:** `/dashboard/settings` - User preferences

### Project Categories

- **Student** - For academic projects and assignments
- **Team** - For collaborative team projects
- **Business** - For business and enterprise projects

### Task Statuses

- **To Do** - Tasks that haven't been started
- **In Progress** - Tasks currently being worked on
- **Review** - Tasks pending review
- **Completed** - Finished tasks

### Task Priorities

- **Low** - Minor tasks
- **Medium** - Standard priority
- **High** - Important tasks
- **Urgent** - Critical tasks requiring immediate attention

## Color Scheme

The application uses a modern charcoal and amber color palette:

- **Primary:** Amber (#f59e0b)
- **Background:** Charcoal shades (#1c1917, #292524, #44403c)
- **Text:** Warm off-white (#fafaf9)
- **Accents:** Amber variations for highlights and interactive elements

## API Routes

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Projects
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/[id]` - Get project details
- `PATCH /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project

### Tasks
- `GET /api/tasks` - List all tasks
- `POST /api/tasks` - Create new task
- `PATCH /api/tasks/[id]` - Update task
- `DELETE /api/tasks/[id]` - Delete task

### Activity
- `GET /api/activity` - Get user activity feed

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## Features Breakdown

### Authentication
- Secure JWT-based authentication
- Password hashing with bcrypt
- HttpOnly cookies for token storage
- Email validation
- Protected routes

### Project Management
- Create, read, update, delete projects
- Project categories (Student, Team, Business)
- Project status tracking
- Project members and roles
- Deadline management

### Task Management
- Kanban board interface
- Drag-and-drop functionality
- Task priorities and statuses
- Due dates and tags
- Task assignments
- Task descriptions and details

### User Experience
- Smooth page transitions
- Loading states and skeletons
- Toast notifications
- Empty states
- Responsive navigation
- Collapsible sidebar
- Search functionality
- Activity tracking

## Security Features

- JWT token authentication
- Password hashing
- HTTP-only cookies
- CORS protection
- Input validation
- Role-based access control

## Responsive Design

The application is fully responsive with breakpoints for:
- Mobile (< 640px)
- Tablet (640px - 1024px)
- Desktop (> 1024px)

## Performance Optimizations

- Server Components for static content
- Client Components only where needed
- Optimized database queries
- Indexed MongoDB collections
- Lazy loading
- Image optimization

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- Real-time collaboration with WebSockets
- File attachments for tasks
- Task comments system
- Email notifications
- Calendar view
- Gantt chart view
- Export functionality
- Advanced analytics
- Mobile app

## License

This project is provided as-is for educational and commercial use.

## Support

For issues or questions, please create an issue in the project repository.

---

Built with ❤️ using Next.js and modern web technologies.
# ProjectHub
