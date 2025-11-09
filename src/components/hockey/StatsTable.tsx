import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Team } from './types';

interface StatsTableProps {
  teams: Team[];
  isAdmin: boolean;
  onMoveTeam: (team: Team, direction: 'up' | 'down') => void;
  onEditTeam: (team: Team) => void;
  onDeleteTeam: (id: number) => void;
}

export default function StatsTable({ 
  teams, 
  isAdmin, 
  onMoveTeam, 
  onEditTeam, 
  onDeleteTeam 
}: StatsTableProps) {
  return (
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
                          onClick={() => onMoveTeam(team, 'up')}
                          disabled={index === 0}
                          className="p-1 hover:bg-cyan-500/20 rounded disabled:opacity-30"
                        >
                          <Icon name="ChevronUp" size={16} />
                        </button>
                        <button
                          onClick={() => onMoveTeam(team, 'down')}
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
                          onClick={() => onEditTeam(team)}
                          className="hover:bg-cyan-500/20"
                        >
                          <Icon name="Edit" size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onDeleteTeam(team.id)}
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
  );
}
