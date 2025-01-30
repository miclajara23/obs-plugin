import React, { useState } from 'react';
import { Plus, GripVertical, Clock, Trash2, Sun, Moon } from 'lucide-react';
import { Card, CardContent } from './components/ui/card';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";

import * as Lucide from 'lucide-react';

// Set the icons as JSX components
const GripVerticalIcon = <Lucide.GripVertical />;
const ClockIcon = <Lucide.Clock />;
const Trash2Icon = <Lucide.Trash2 />;
const SunIcon = <Lucide.Sun />;
const MoonIcon = <Lucide.Moon />;
const PlusIcon = <Lucide.Plus />;


// Define types for the Activity and props
interface Activity {
  id: string;
  name: string;
  duration: number;
}

interface ActivityCardProps {
  activity: Activity;
  index: number;
  onDelete: (id: string) => void;
  onDurationChange: (id: string, newDuration: string) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  index,
  onDelete,
  onDurationChange,
  onDragStart,
  onDragEnd,
  onDragOver,
}) => (
  <div
    draggable
    onDragStart={(e) => onDragStart(e, index)}
    onDragEnd={onDragEnd}
    onDragOver={(e) => onDragOver(e, index)}
    className="mb-3"
  >
    <Card className="border border-gray-200">
      <CardContent className="p-4 flex items-center gap-3">
        <div className="cursor-grab">
          <GripVertical className="text-gray-400" />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">{activity.name}</h4>
          <div className="flex items-center gap-2 mt-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <Input
              type="number"
              value={activity.duration}
              onChange={(e) => onDurationChange(activity.id, e.target.value)}
              className="w-20 h-8"
              min="1"
            />
            <span className="text-sm text-gray-500">minutes</span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(activity.id)}
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </CardContent>
    </Card>
  </div>
);

const RoutineBuilder: React.FC = () => {
  const [routineType, setRoutineType] = useState('morning');
  const [startTime, setStartTime] = useState('06:00');

  const [selectedActivities, setSelectedActivities] = useState<Activity[]>([
    { id: '1', name: 'Gratitude Journal', duration: 10 },
  ]);

  const [availableActivities, setAvailableActivities] = useState<Activity[]>([
    { id: '2', name: 'Worry Journal', duration: 10 },
    { id: '3', name: 'HIIT Workout', duration: 20 },
    { id: '4', name: 'Meditation', duration: 15 },
    { id: '5', name: 'Yoga', duration: 15 },
    { id: '6', name: 'Reading', duration: 20 },
    { id: '7', name: 'Journaling', duration: 15 },
    { id: '8', name: 'Stretching', duration: 10 },
  ]);

  const [newActivity, setNewActivity] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragSource, setDragSource] = useState<'selected' | 'available' | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number, source: 'selected' | 'available') => {
    setDraggedIndex(index);
    setDragSource(source);
    e.currentTarget.classList.add('opacity-50');
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    setDraggedIndex(null);
    setDragSource(null);
    e.currentTarget.classList.remove('opacity-50');
  };

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    index: number,
    targetList: 'selected' | 'available'
  ) => {
    e.preventDefault();
    if (draggedIndex === null) return;

    const sourceList = dragSource === 'selected' ? selectedActivities : availableActivities;
    const sourceSetFunction = dragSource === 'selected' ? setSelectedActivities : setAvailableActivities;
    const targetSetFunction = targetList === 'selected' ? setSelectedActivities : setAvailableActivities;

    if (dragSource === targetList) {
      const newItems = [...sourceList];
      const draggedItem = newItems[draggedIndex];
      newItems.splice(draggedIndex, 1);
      newItems.splice(index, 0, draggedItem);
      sourceSetFunction(newItems);
    } else {
      const sourceItems = [...sourceList];
      const targetItems = dragSource === 'selected' ? [...availableActivities] : [...selectedActivities];
      const [draggedItem] = sourceItems.splice(draggedIndex, 1);
      targetItems.splice(index, 0, draggedItem);

      // Update the states accordingly
      sourceSetFunction(sourceItems);
      if (dragSource === 'selected') {
        setAvailableActivities(targetItems);
      } else {
        setSelectedActivities(targetItems);
      }
    }

    setDraggedIndex(index);
    setDragSource(targetList);
  };

  const addCustomActivity = () => {
    if (!newActivity.trim()) return;

    const newId = Date.now().toString();
    const newActivityItem: Activity = { id: newId, name: newActivity, duration: 10 };
    setSelectedActivities([...selectedActivities, newActivityItem]);
    setNewActivity('');
  };

  const handleDelete = (id: string) => {
    setSelectedActivities(selectedActivities.filter((activity) => activity.id !== id));
  };

  const handleDurationChange = (id: string, newDuration: string) => {
    setSelectedActivities(
      selectedActivities.map((activity) =>
        activity.id === id ? { ...activity, duration: parseInt(newDuration) || 0 } : activity
      )
    );
  };

  const handleSave = () => {
    const yamlContent = `
type: ${routineType}
startTime: ${startTime}
activities:
${selectedActivities
  .map(
    (activity) =>
      `  - name: ${activity.name}\n    duration: ${activity.duration}`
  )
  .join('\n')}
`;

    const markdownContent = `---\n${yamlContent}\n---`;
    console.log('Saving routine:', markdownContent);
    alert('Routine saved!');
  };

  const totalDuration = selectedActivities.reduce((sum, activity) => sum + activity.duration, 0);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Routine Builder</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Select value={routineType} onValueChange={setRoutineType}>
              <SelectTrigger className="w-36">
                <SelectValue>
                  {routineType === 'morning' ? (
                    <div className="flex items-center gap-2">
                      <Sun className="w-4 h-4" />
                      Morning
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Moon className="w-4 h-4" />
                      Evening
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="morning">
                  <div className="flex items-center gap-2">
                    <Sun className="w-4 h-4" />
                    Morning
                  </div>
                </SelectItem>
                <SelectItem value="evening">
                  <div className="flex items-center gap-2">
                    <Moon className="w-4 h-4" />
                    Evening
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-32"
          />
        </div>
      </div>

      {/* Add Activity */}
      <div className="mb-6 flex gap-2">
        <Input
          placeholder="Add custom activity..."
          value={newActivity}
          onChange={(e) => setNewActivity(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addCustomActivity()}
          className="flex-1"
        />
        <Button onClick={addCustomActivity}>
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
      </div>

      {/* Activities Lists */}
      <div className="grid grid-cols-2 gap-6">
        {/* Selected Activities */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Your Routine</h3>
          <div className="mb-2 text-sm text-gray-500">Total Duration: {totalDuration} minutes</div>
          <div
            className="border rounded-lg p-4 min-h-96"
            onDragOver={(e) => e.preventDefault()}
          >
            {selectedActivities.map((activity, index) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                index={index}
                onDelete={handleDelete}
                onDurationChange={handleDurationChange}
                onDragStart={(e, i) => handleDragStart(e, i, 'selected')}
                onDragEnd={handleDragEnd}
                onDragOver={(e, i) => handleDragOver(e, i, 'selected')}
              />
            ))}
          </div>
        </div>

        {/* Available Activities */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Available Activities</h3>
          <div className="border rounded-lg p-4 min-h-96">
            {availableActivities.map((activity, index) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                index={index}
                onDelete={handleDelete}
                onDurationChange={handleDurationChange}
                onDragStart={(e, i) => handleDragStart(e, i, 'available')}
                onDragEnd={handleDragEnd}
                onDragOver={(e, i) => handleDragOver(e, i, 'available')}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <Button onClick={handleSave} className="mt-6">
        Save Routine
      </Button>
    </div>
  );
};

export default RoutineBuilder;
