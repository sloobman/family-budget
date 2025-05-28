import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Plus, User, Edit, Trash2, Home } from 'lucide-react';
import { familyAPI, MemberData } from '../api/client';

const FamilyMembers = () => {
  const [members, setMembers] = useState<MemberData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await familyAPI.getMembers();
        setMembers(response.data);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch family members');
        setIsLoading(false);
        console.error('Error fetching family members:', err);
      }
    };

    fetchMembers();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      // Assuming you have a delete endpoint in your API
      await familyAPI.deleteFamilyMember(id);
      setMembers(prevMembers => prevMembers.filter(member => member.id !== id));
    } catch (err) {
      setError('Failed to delete family member');
      console.error('Error deleting family member:', err);
    }
  };

  const getRelationColor = (relation: string) => {
    switch (relation.toLowerCase()) {
      case 'mother':
        return 'bg-pink-100 text-pink-800';
      case 'father':
        return 'bg-blue-100 text-blue-800';
      case 'child':
        return 'bg-green-100 text-green-800';
      case 'spouse':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <Link
              to="/dashboard"
              className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition-colors duration-200"
            >
              <Home className="h-5 w-5 text-gray-600" />
              <span className="text-gray-700 font-medium">На главную</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Users className="h-8 w-8 mr-2 text-orange-500" />
            Члены семьи
          </h1>
          
          <Link
            to="/add-family-member"
            className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition-colors duration-200"
          >
            <Plus className="h-5 w-5 text-gray-600" />
            <span className="text-gray-700 font-medium">Добавить члена семьи</span>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        ) : members.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member) => (
              <div key={member.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow duration-200">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="h-6 w-6 text-gray-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">{member.name}</h3>
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRelationColor(member.relation)}`}>
                      {member.relation}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50 px-6 py-4">
                  <div className="flex justify-end space-x-3">
                    <Link
                      to={`/family-members/${member.id}/edit`}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <Edit className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(member.id)}
                      className="text-gray-600 hover:text-red-500"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">Нет членов семьи</h3>
            <p className="mt-1 text-sm text-gray-500">Начните с добавления первого члена семьи.</p>
            <div className="mt-6">
              <Link
                to="/add-family-member"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="-ml-1 mr-2 h-5 w-5" />
                Добавить члена семьи
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FamilyMembers;