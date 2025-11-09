import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Team } from './types';

interface AdminDialogsProps {
  showPasswordDialog: boolean;
  setShowPasswordDialog: (show: boolean) => void;
  password: string;
  setPassword: (password: string) => void;
  onPasswordSubmit: () => void;
  
  showTeamDialog: boolean;
  setShowTeamDialog: (show: boolean) => void;
  newTeamName: string;
  setNewTeamName: (name: string) => void;
  newTeamLogo: string;
  onAddTeam: () => void;
  onLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  
  showEditDialog: boolean;
  setShowEditDialog: (show: boolean) => void;
  currentTeam: Team | null;
  setCurrentTeam: (team: Team | null) => void;
  onUpdateTeam: () => void;
}

export default function AdminDialogs({
  showPasswordDialog,
  setShowPasswordDialog,
  password,
  setPassword,
  onPasswordSubmit,
  showTeamDialog,
  setShowTeamDialog,
  newTeamName,
  setNewTeamName,
  newTeamLogo,
  onAddTeam,
  onLogoUpload,
  showEditDialog,
  setShowEditDialog,
  currentTeam,
  setCurrentTeam,
  onUpdateTeam,
}: AdminDialogsProps) {
  return (
    <>
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
                onKeyDown={(e) => e.key === 'Enter' && onPasswordSubmit()}
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <Button
              onClick={onPasswordSubmit}
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
                onChange={onLogoUpload}
                className="bg-gray-800 border-gray-700"
              />
              {newTeamLogo && (
                <img src={newTeamLogo} alt="Preview" className="mt-2 w-20 h-20 object-contain" />
              )}
            </div>
            <Button
              onClick={onAddTeam}
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
                  onChange={onLogoUpload}
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
                onClick={onUpdateTeam}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
              >
                Сохранить
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
