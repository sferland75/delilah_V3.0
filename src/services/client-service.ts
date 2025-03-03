/**
 * Client Service
 * 
 * Provides functions to retrieve and manipulate client data.
 */

// Type definition for client information
export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  address?: string;
  phone?: string;
  email?: string;
  referralSource?: string;
  referralDate?: string;
  status: 'active' | 'inactive' | 'archived';
  createdAt: string;
  updatedAt: string;
}

// Cache for client data
const clientCache: Map<string, Client> = new Map();
const cacheTimestamps: Map<string, number> = new Map();
const CACHE_EXPIRY_MS = 60000; // 1 minute

/**
 * Get a client by ID
 */
export async function getClientById(clientId: string): Promise<Client | null> {
  // Check cache first
  const now = Date.now();
  const cachedTimestamp = cacheTimestamps.get(clientId);
  
  if (cachedTimestamp && (now - cachedTimestamp < CACHE_EXPIRY_MS)) {
    const cachedClient = clientCache.get(clientId);
    if (cachedClient) {
      return cachedClient;
    }
  }
  
  try {
    // Fetch from backend
    const response = await fetch(`/api/clients/${clientId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch client: ${response.statusText}`);
    }
    
    const client = await response.json();
    
    // Update cache
    clientCache.set(clientId, client);
    cacheTimestamps.set(clientId, now);
    
    return client;
  } catch (error) {
    console.warn(`Failed to fetch client ${clientId}:`, error);
    
    // Fallback to local storage if available
    try {
      const savedClients = localStorage.getItem('clients');
      if (savedClients) {
        const parsedClients = JSON.parse(savedClients);
        const client = parsedClients.find((c: Client) => c.id === clientId);
        
        if (client) {
          // Update cache
          clientCache.set(clientId, client);
          cacheTimestamps.set(clientId, now);
          
          return client;
        }
      }
    } catch (localStorageError) {
      console.error('Failed to retrieve client from localStorage:', localStorageError);
    }
    
    // If client ID is the demo client, return mock data
    if (clientId === 'current-client-id' || clientId === 'demo-client') {
      const mockClient = getMockClient(clientId);
      
      // Update cache
      clientCache.set(clientId, mockClient);
      cacheTimestamps.set(clientId, now);
      
      return mockClient;
    }
    
    return null;
  }
}

/**
 * Get current client ID from the application state
 */
export function getCurrentClientId(): string | null {
  // This should come from your app's state management
  // For now, returning a placeholder
  return 'current-client-id';
}

/**
 * Get a list of all clients
 */
export async function getAllClients(): Promise<Client[]> {
  try {
    // Fetch from backend
    const response = await fetch('/api/clients');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch clients: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.warn('Failed to fetch clients:', error);
    
    // Fallback to local storage if available
    try {
      const savedClients = localStorage.getItem('clients');
      if (savedClients) {
        return JSON.parse(savedClients);
      }
    } catch (localStorageError) {
      console.error('Failed to retrieve clients from localStorage:', localStorageError);
    }
    
    // Return mock clients in fallback scenario
    return [
      getMockClient('client-1'),
      getMockClient('client-2'),
      getMockClient('client-3')
    ];
  }
}

/**
 * Create a new client
 */
export async function createClient(clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<Client | null> {
  try {
    const response = await fetch('/api/clients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(clientData)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create client: ${response.statusText}`);
    }
    
    const newClient = await response.json();
    
    // Update cache
    clientCache.set(newClient.id, newClient);
    cacheTimestamps.set(newClient.id, Date.now());
    
    // Update local storage as well
    try {
      const savedClients = localStorage.getItem('clients');
      const clients = savedClients ? JSON.parse(savedClients) : [];
      clients.push(newClient);
      localStorage.setItem('clients', JSON.stringify(clients));
    } catch (localStorageError) {
      console.warn('Failed to update localStorage with new client:', localStorageError);
    }
    
    return newClient;
  } catch (error) {
    console.error('Failed to create client:', error);
    return null;
  }
}

/**
 * Update an existing client
 */
export async function updateClient(clientId: string, clientData: Partial<Client>): Promise<Client | null> {
  try {
    const response = await fetch(`/api/clients/${clientId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(clientData)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update client: ${response.statusText}`);
    }
    
    const updatedClient = await response.json();
    
    // Update cache
    clientCache.set(clientId, updatedClient);
    cacheTimestamps.set(clientId, Date.now());
    
    // Update local storage as well
    try {
      const savedClients = localStorage.getItem('clients');
      if (savedClients) {
        const clients = JSON.parse(savedClients);
        const index = clients.findIndex((c: Client) => c.id === clientId);
        if (index !== -1) {
          clients[index] = updatedClient;
          localStorage.setItem('clients', JSON.stringify(clients));
        }
      }
    } catch (localStorageError) {
      console.warn('Failed to update client in localStorage:', localStorageError);
    }
    
    return updatedClient;
  } catch (error) {
    console.error(`Failed to update client ${clientId}:`, error);
    
    // Attempt a local storage update as fallback
    try {
      const savedClients = localStorage.getItem('clients');
      if (savedClients) {
        const clients = JSON.parse(savedClients);
        const index = clients.findIndex((c: Client) => c.id === clientId);
        if (index !== -1) {
          const updatedClient = {
            ...clients[index],
            ...clientData,
            updatedAt: new Date().toISOString()
          };
          clients[index] = updatedClient;
          localStorage.setItem('clients', JSON.stringify(clients));
          
          // Update cache
          clientCache.set(clientId, updatedClient);
          cacheTimestamps.set(clientId, Date.now());
          
          return updatedClient;
        }
      }
    } catch (localStorageError) {
      console.error('Failed to update client in localStorage:', localStorageError);
    }
    
    return null;
  }
}

/**
 * Delete a client (mark as archived)
 */
export async function archiveClient(clientId: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/clients/${clientId}/archive`, {
      method: 'POST'
    });
    
    if (!response.ok) {
      throw new Error(`Failed to archive client: ${response.statusText}`);
    }
    
    // Update cache - remove the client from cache to force a refresh next time
    clientCache.delete(clientId);
    cacheTimestamps.delete(clientId);
    
    // Update local storage as well
    try {
      const savedClients = localStorage.getItem('clients');
      if (savedClients) {
        const clients = JSON.parse(savedClients);
        const index = clients.findIndex((c: Client) => c.id === clientId);
        if (index !== -1) {
          clients[index].status = 'archived';
          clients[index].updatedAt = new Date().toISOString();
          localStorage.setItem('clients', JSON.stringify(clients));
        }
      }
    } catch (localStorageError) {
      console.warn('Failed to archive client in localStorage:', localStorageError);
    }
    
    return true;
  } catch (error) {
    console.error(`Failed to archive client ${clientId}:`, error);
    
    // Attempt a local storage update as fallback
    try {
      const savedClients = localStorage.getItem('clients');
      if (savedClients) {
        const clients = JSON.parse(savedClients);
        const index = clients.findIndex((c: Client) => c.id === clientId);
        if (index !== -1) {
          clients[index].status = 'archived';
          clients[index].updatedAt = new Date().toISOString();
          localStorage.setItem('clients', JSON.stringify(clients));
          return true;
        }
      }
    } catch (localStorageError) {
      console.error('Failed to archive client in localStorage:', localStorageError);
    }
    
    return false;
  }
}

/**
 * Clear the client cache
 */
export function clearClientCache(): void {
  clientCache.clear();
  cacheTimestamps.clear();
}

/**
 * Generate a mock client for development/testing
 */
function getMockClient(clientId: string): Client {
  // Generate deterministic data based on client ID
  const idHash = clientId.split('').reduce((a, b) => {
    return a + b.charCodeAt(0);
  }, 0);
  
  const firstNames = ['John', 'Jane', 'Michael', 'Susan', 'David', 'Emma', 'Robert', 'Lisa'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Wilson'];
  
  const firstName = firstNames[idHash % firstNames.length];
  const lastName = lastNames[(idHash + 3) % lastNames.length];
  
  // Create date of birth (40-70 years ago)
  const currentYear = new Date().getFullYear();
  const birthYear = currentYear - (40 + (idHash % 30));
  const birthMonth = 1 + (idHash % 12);
  const birthDay = 1 + (idHash % 28);
  const dob = `${birthYear}-${birthMonth.toString().padStart(2, '0')}-${birthDay.toString().padStart(2, '0')}`;
  
  // Creation date (1-3 years ago)
  const createdYear = currentYear - (1 + (idHash % 3));
  const createdMonth = 1 + ((idHash + 2) % 12);
  const createdDay = 1 + ((idHash + 4) % 28);
  const createdAt = `${createdYear}-${createdMonth.toString().padStart(2, '0')}-${createdDay.toString().padStart(2, '0')}T10:00:00Z`;
  
  // Update date (more recent than creation)
  const updatedYear = createdYear + ((idHash % 2 === 0) ? 1 : 0);
  const updatedMonth = 1 + ((idHash + 5) % 12);
  const updatedDay = 1 + ((idHash + 6) % 28);
  const updatedAt = `${updatedYear}-${updatedMonth.toString().padStart(2, '0')}-${updatedDay.toString().padStart(2, '0')}T14:30:00Z`;
  
  return {
    id: clientId,
    firstName,
    lastName,
    dateOfBirth: dob,
    address: `${123 + (idHash % 800)} Main St, Anytown, CA`,
    phone: `555-${(100 + (idHash % 900)).toString().padStart(3, '0')}-${(1000 + (idHash % 9000)).toString().padStart(4, '0')}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
    referralSource: idHash % 3 === 0 ? 'Dr. James Reynolds' : idHash % 3 === 1 ? 'Dr. Sarah Miller' : 'Self-referred',
    referralDate: `${currentYear}-${(1 + (idHash % 12)).toString().padStart(2, '0')}-${(1 + (idHash % 28)).toString().padStart(2, '0')}`,
    status: 'active',
    createdAt,
    updatedAt
  };
}
