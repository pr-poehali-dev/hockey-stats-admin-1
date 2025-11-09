import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { API_URL, Team } from '@/components/hockey/types';
import StatsTable from '@/components/hockey/StatsTable';
import AdminDialogs from '@/components/hockey/AdminDialogs';

export default function Index() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showTeamDialog, setShowTeamDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [password, setPassword] = useState('');
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamLogo, setNewTeamLogo] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setTeams(data);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить команды',
        variant: 'destructive',
      });
    }
  };

  const handlePasswordSubmit = () => {
    if (password === 'vmhl2000') {
      setIsAdmin(true);
      setShowPasswordDialog(false);
      toast({
        title: 'Успешно',
        description: 'Вы вошли в режим администратора',
      });
    } else {
      toast({
        title: 'Ошибка',
        description: 'Неверный пароль',
        variant: 'destructive',
      });
    }
  };

  const handleAddTeam = async () => {
    if (!newTeamName) return;
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Password': 'vmhl2000',
        },
        body: JSON.stringify({
          name: newTeamName,
          logo_url: newTeamLogo,
        }),
      });

      if (response.ok) {
        await fetchTeams();
        setShowTeamDialog(false);
        setNewTeamName('');
        setNewTeamLogo('');
        toast({
          title: 'Успешно',
          description: 'Команда добавлена',
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось добавить команду',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateTeam = async () => {
    if (!currentTeam) return;

    try {
      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Password': 'vmhl2000',
        },
        body: JSON.stringify(currentTeam),
      });

      if (response.ok) {
        await fetchTeams();
        setShowEditDialog(false);
        setCurrentTeam(null);
        toast({
          title: 'Успешно',
          description: 'Данные обновлены',
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить данные',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteTeam = async (id: number) => {
    if (!confirm('Удалить команду?')) return;

    try {
      const response = await fetch(API_URL, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Password': 'vmhl2000',
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        await fetchTeams();
        toast({
          title: 'Успешно',
          description: 'Команда удалена',
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить команду',
        variant: 'destructive',
      });
    }
  };

  const handleMoveTeam = async (team: Team, direction: 'up' | 'down') => {
    const currentIndex = teams.findIndex(t => t.id === team.id);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === teams.length - 1)
    ) {
      return;
    }

    const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const swapTeam = teams[swapIndex];

    try {
      await fetch(API_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Password': 'vmhl2000',
        },
        body: JSON.stringify({ id: team.id, position: swapTeam.position }),
      });

      await fetch(API_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Password': 'vmhl2000',
        },
        body: JSON.stringify({ id: swapTeam.id, position: team.position }),
      });

      await fetchTeams();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось переместить команду',
        variant: 'destructive',
      });
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (currentTeam) {
          setCurrentTeam({ ...currentTeam, logo_url: reader.result as string });
        } else {
          setNewTeamLogo(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1628] via-[#0D1B2A] to-[#1B263B] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
              VMHL
            </h1>
            <p className="text-gray-400">Турнирная таблица</p>
          </div>
          
          <Button
            onClick={() => {
              if (isAdmin) {
                setIsAdmin(false);
                toast({
                  title: 'Выход',
                  description: 'Режим администратора отключен',
                });
              } else {
                setShowPasswordDialog(true);
              }
            }}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
          >
            <Icon name={isAdmin ? 'LogOut' : 'Lock'} size={20} className="mr-2" />
            {isAdmin ? 'Выйти' : 'Админ'}
          </Button>
        </div>

        {isAdmin && (
          <div className="mb-6 flex gap-3 animate-slide-up">
            <Button
              onClick={() => setShowTeamDialog(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              <Icon name="Plus" size={20} className="mr-2" />
              Добавить команду
            </Button>
          </div>
        )}

        <StatsTable
          teams={teams}
          isAdmin={isAdmin}
          onMoveTeam={handleMoveTeam}
          onEditTeam={(team) => {
            setCurrentTeam(team);
            setShowEditDialog(true);
          }}
          onDeleteTeam={handleDeleteTeam}
        />
      </div>

      <AdminDialogs
        showPasswordDialog={showPasswordDialog}
        setShowPasswordDialog={setShowPasswordDialog}
        password={password}
        setPassword={setPassword}
        onPasswordSubmit={handlePasswordSubmit}
        showTeamDialog={showTeamDialog}
        setShowTeamDialog={setShowTeamDialog}
        newTeamName={newTeamName}
        setNewTeamName={setNewTeamName}
        newTeamLogo={newTeamLogo}
        onAddTeam={handleAddTeam}
        onLogoUpload={handleLogoUpload}
        showEditDialog={showEditDialog}
        setShowEditDialog={setShowEditDialog}
        currentTeam={currentTeam}
        setCurrentTeam={setCurrentTeam}
        onUpdateTeam={handleUpdateTeam}
      />
    </div>
  );
}
