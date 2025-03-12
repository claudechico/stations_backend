// Default permissions for each role
export const defaultPermissions = {
    admin: [
      // Dashboard
      { resource: 'dashboard', action: 'view' },
      
      // User management
      { resource: 'users', action: 'create' },
      { resource: 'users', action: 'read' },
      { resource: 'users', action: 'update' },
      { resource: 'users', action: 'delete' },
      { resource: 'users', action: 'manage' },
      
      // Company management
      { resource: 'companies', action: 'create' },
      { resource: 'companies', action: 'read' },
      { resource: 'companies', action: 'update' },
      { resource: 'companies', action: 'delete' },
      { resource: 'companies', action: 'manage' },
      
      // Station management
      { resource: 'stations', action: 'create' },
      { resource: 'stations', action: 'read' },
      { resource: 'stations', action: 'update' },
      { resource: 'stations', action: 'delete' },
      { resource: 'stations', action: 'manage' },
      
      // Location management
      { resource: 'countries', action: 'manage' },
      { resource: 'regions', action: 'manage' },
      { resource: 'cities', action: 'manage' },
      { resource: 'locations', action: 'manage' },
      
      // Permission management
      { resource: 'permissions', action: 'manage' }
    ],
    
    director: [
      // Dashboard
      { resource: 'dashboard', action: 'view' },
      
      // Company management (own company only)
      { resource: 'companies', action: 'read' },
      { resource: 'companies', action: 'update' },
      
      // Station management (own company's stations)
      { resource: 'stations', action: 'create' },
      { resource: 'stations', action: 'read' },
      { resource: 'stations', action: 'update' },
      { resource: 'stations', action: 'delete' },
      { resource: 'stations', action: 'manage' },
      
      // User management (company managers only)
      { resource: 'users', action: 'create' },
      { resource: 'users', action: 'read' },
      { resource: 'users', action: 'update' },
      
      // Location reading
      { resource: 'countries', action: 'read' },
      { resource: 'regions', action: 'read' },
      { resource: 'cities', action: 'read' }
    ],
    
    manager: [
      // Dashboard
      { resource: 'dashboard', action: 'view' },
      
      // Station management (own station only)
      { resource: 'stations', action: 'read' },
      { resource: 'stations', action: 'update' },
      
      // Location reading
      { resource: 'countries', action: 'read' },
      { resource: 'regions', action: 'read' },
      { resource: 'cities', action: 'read' }
    ]
  };
  
  // Create a comprehensive list of all unique permissions from role definitions
  export const defaultPermissionDefinitions = [
    // Dashboard
    { name: 'view_dashboard', description: 'Can view dashboard', resource: 'dashboard', action: 'view' },
    
    // Users
    { name: 'create_users', description: 'Can create users', resource: 'users', action: 'create' },
    { name: 'read_users', description: 'Can read users', resource: 'users', action: 'read' },
    { name: 'update_users', description: 'Can update users', resource: 'users', action: 'update' },
    { name: 'delete_users', description: 'Can delete users', resource: 'users', action: 'delete' },
    { name: 'manage_users', description: 'Can manage all user operations', resource: 'users', action: 'manage' },
    
    // Companies
    { name: 'create_companies', description: 'Can create companies', resource: 'companies', action: 'create' },
    { name: 'read_companies', description: 'Can read companies', resource: 'companies', action: 'read' },
    { name: 'update_companies', description: 'Can update companies', resource: 'companies', action: 'update' },
    { name: 'delete_companies', description: 'Can delete companies', resource: 'companies', action: 'delete' },
    { name: 'manage_companies', description: 'Can manage all company operations', resource: 'companies', action: 'manage' },
    
    // Stations
    { name: 'create_stations', description: 'Can create stations', resource: 'stations', action: 'create' },
    { name: 'read_stations', description: 'Can read stations', resource: 'stations', action: 'read' },
    { name: 'update_stations', description: 'Can update stations', resource: 'stations', action: 'update' },
    { name: 'delete_stations', description: 'Can delete stations', resource: 'stations', action: 'delete' },
    { name: 'manage_stations', description: 'Can manage all station operations', resource: 'stations', action: 'manage' },
    
    // Locations
    { name: 'manage_countries', description: 'Can manage countries', resource: 'countries', action: 'manage' },
    { name: 'read_countries', description: 'Can read countries', resource: 'countries', action: 'read' },
    { name: 'manage_regions', description: 'Can manage regions', resource: 'regions', action: 'manage' },
    { name: 'read_regions', description: 'Can read regions', resource: 'regions', action: 'read' },
    { name: 'manage_cities', description: 'Can manage cities', resource: 'cities', action: 'manage' },
    { name: 'read_cities', description: 'Can read cities', resource: 'cities', action: 'read' },
    { name: 'manage_locations', description: 'Can manage all location operations', resource: 'locations', action: 'manage' },
    
    // Permissions
    { name: 'manage_permissions', description: 'Can manage permissions', resource: 'permissions', action: 'manage' }
  ];