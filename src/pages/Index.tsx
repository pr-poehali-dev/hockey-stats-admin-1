import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const API_URL = 'https://functions.poehali.dev/cb589473-199a-493a-b7b2-14d8f24a8bee';

interface Team {
  id: number;
  name: string;
  logo_url: string;
  games_played: number;
  wins: number;
  losses: number;
  ot_losses: number;
  goals_for: number;
  goals_against: number;
  points: number;
  position: number;
}

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

        <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-lg rounded-2xl overflow-hidden border border-cyan-500/20 shadow-2xl animate-slide-up">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-cyan-600/30 to-blue-600/30 border-b border-cyan-500/20">
                  {isAdmin && <th className="px-4 py-4 text-left text-sm font-semibold text-cyan-300">#</th>}
                  <th className="px-4 py-4 text-left text-sm font-semibold text-cyan-300">Место</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-cyan-300">Команда</th>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-cyan-300">И</th>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-cyan-300">В</th>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-cyan-300">П</th>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-cyan-300">ПО</th>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-cyan-300">Ш+</th>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-cyan-300">Ш-</th>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-cyan-300">О</th>
                  {isAdmin && <th className="px-4 py-4 text-right text-sm font-semibold text-cyan-300">Действия</th>}
                </tr>
              </thead>
              <tbody>
                {teams.length === 0 ? (
                  <tr>
                    <td colSpan={isAdmin ? 12 : 10} className="px-4 py-12 text-center text-gray-400">
                      <Icon name="Database" size={48} className="mx-auto mb-3 opacity-30" />
                      <p>Таблица пуста. {isAdmin && 'Добавьте первую команду.'}</p>
                    </td>
                  </tr>
                ) : (
                  teams.map((team, index) => (
                    <tr
                      key={team.id}
                      className="border-b border-gray-700/50 hover:bg-cyan-500/5 transition-colors group"
                    >
                      {isAdmin && (
                        <td className="px-4 py-4">
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleMoveTeam(team, 'up')}
                              disabled={index === 0}
                              className="p-1 hover:bg-cyan-500/20 rounded disabled:opacity-30"
                            >
                              <Icon name="ChevronUp" size={16} />
                            </button>
                            <button
                              onClick={() => handleMoveTeam(team, 'down')}
                              disabled={index === teams.length - 1}
                              className="p-1 hover:bg-cyan-500/20 rounded disabled:opacity-30"
                            >
                              <Icon name="ChevronDown" size={16} />
                            </button>
                          </div>
                        </td>
                      )}
                      <td className="px-4 py-4 text-center font-bold text-lg text-cyan-400">
                        {index + 1}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          {team.logo_url ? (
                            <img
                              src={team.logo_url}
                              alt={team.name}
                              className="w-10 h-10 object-contain rounded"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded flex items-center justify-center">
                              <Icon name="Shield" size={20} className="text-cyan-400" />
                            </div>
                          )}
                          <span className="font-medium">{team.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">{team.games_played}</td>
                      <td className="px-4 py-4 text-center text-green-400 font-semibold">{team.wins}</td>
                      <td className="px-4 py-4 text-center text-red-400 font-semibold">{team.losses}</td>
                      <td className="px-4 py-4 text-center text-yellow-400 font-semibold">{team.ot_losses}</td>
                      <td className="px-4 py-4 text-center">{team.goals_for}</td>
                      <td className="px-4 py-4 text-center">{team.goals_against}</td>
                      <td className="px-4 py-4 text-center">
                        <span className="inline-block px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full font-bold text-cyan-300">
                          {team.points}
                        </span>
                      </td>
                      {isAdmin && (
                        <td className="px-4 py-4 text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setCurrentTeam(team);
                                setShowEditDialog(true);
                              }}
                              className="hover:bg-cyan-500/20"
                            >
                              <Icon name="Edit" size={16} />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteTeam(team.id)}
                              className="hover:bg-red-500/20 text-red-400"
                            >
                              <Icon name="Trash2" size={16} />
                            </Button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="bg-gray-900 border-cyan-500/30">
          <DialogHeader>
            <DialogTitle className="text-cyan-400">Вход в админ-панель</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <Button
              onClick={handlePasswordSubmit}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
            >
              Войти
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showTeamDialog} onOpenChange={setShowTeamDialog}>
        <DialogContent className="bg-gray-900 border-cyan-500/30">
          <DialogHeader>
            <DialogTitle className="text-cyan-400">Добавить команду</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="teamName">Название команды</Label>
              <Input
                id="teamName"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div>
              <Label htmlFor="teamLogo">Логотип</Label>
              <Input
                id="teamLogo"
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="bg-gray-800 border-gray-700"
              />
              {newTeamLogo && (
                <img src={newTeamLogo} alt="Preview" className="mt-2 w-20 h-20 object-contain" />
              )}
            </div>
            <Button
              onClick={handleAddTeam}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
            >
              Добавить
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="bg-gray-900 border-cyan-500/30 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-cyan-400">Редактировать команду</DialogTitle>
          </DialogHeader>
          {currentTeam && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="editName">Название</Label>
                <Input
                  id="editName"
                  value={currentTeam.name}
                  onChange={(e) => setCurrentTeam({ ...currentTeam, name: e.target.value })}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
              <div>
                <Label htmlFor="editLogo">Логотип</Label>
                <Input
                  id="editLogo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="bg-gray-800 border-gray-700"
                />
                {currentTeam.logo_url && (
                  <img src={currentTeam.logo_url} alt="Preview" className="mt-2 w-20 h-20 object-contain" />
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>И</Label>
                  <Input
                    type="number"
                    value={currentTeam.games_played}
                    onChange={(e) => setCurrentTeam({ ...currentTeam, games_played: parseInt(e.target.value) || 0 })}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <div>
                  <Label>В</Label>
                  <Input
                    type="number"
                    value={currentTeam.wins}
                    onChange={(e) => setCurrentTeam({ ...currentTeam, wins: parseInt(e.target.value) || 0 })}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <div>
                  <Label>П</Label>
                  <Input
                    type="number"
                    value={currentTeam.losses}
                    onChange={(e) => setCurrentTeam({ ...currentTeam, losses: parseInt(e.target.value) || 0 })}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <div>
                  <Label>ПО</Label>
                  <Input
                    type="number"
                    value={currentTeam.ot_losses}
                    onChange={(e) => setCurrentTeam({ ...currentTeam, ot_losses: parseInt(e.target.value) || 0 })}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <div>
                  <Label>Ш+</Label>
                  <Input
                    type="number"
                    value={currentTeam.goals_for}
                    onChange={(e) => setCurrentTeam({ ...currentTeam, goals_for: parseInt(e.target.value) || 0 })}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <div>
                  <Label>Ш-</Label>
                  <Input
                    type="number"
                    value={currentTeam.goals_against}
                    onChange={(e) => setCurrentTeam({ ...currentTeam, goals_against: parseInt(e.target.value) || 0 })}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <div>
                  <Label>Очки</Label>
                  <Input
                    type="number"
                    value={currentTeam.points}
                    onChange={(e) => setCurrentTeam({ ...currentTeam, points: parseInt(e.target.value) || 0 })}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
              </div>
              <Button
                onClick={handleUpdateTeam}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
              >
                Сохранить
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}