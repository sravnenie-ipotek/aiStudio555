'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  PlayCircle, 
  CheckCircle, 
  Clock, 
  Award, 
  TrendingUp,
  Calendar,
  Target,
  Zap,
  Trophy
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface CourseProgressProps {
  courseId: string;
  courseName: string;
  totalLessons: number;
  completedLessons: number;
  currentLesson: {
    id: string;
    title: string;
    duration: string;
    type: 'video' | 'reading' | 'quiz' | 'assignment';
  };
  totalTime: string;
  timeSpent: string;
  lastAccessed: Date;
  estimatedCompletion: Date;
  achievements: Array<{
    id: string;
    title: string;
    icon: string;
    earned: boolean;
  }>;
  streak: number;
}

export function CourseProgress({
  courseId,
  courseName,
  totalLessons,
  completedLessons,
  currentLesson,
  totalTime,
  timeSpent,
  lastAccessed,
  estimatedCompletion,
  achievements,
  streak
}: CourseProgressProps) {
  const { t } = useTranslation();
  const progressPercentage = (completedLessons / totalLessons) * 100;

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video':
        return PlayCircle;
      case 'reading':
        return BookOpen;
      case 'quiz':
        return Target;
      case 'assignment':
        return Trophy;
      default:
        return BookOpen;
    }
  };

  const LessonIcon = getLessonIcon(currentLesson.type);

  return (
    <div className="space-y-6">
      {/* Main Progress Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{courseName}</CardTitle>
            <Badge variant={progressPercentage === 100 ? 'success' : 'default'}>
              {progressPercentage === 100 ? t('progress.completed') : t('progress.inProgress')}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {t('progress.lessonsCompleted', { completed: completedLessons, total: totalLessons })}
              </span>
              <span className="font-medium">{progressPercentage.toFixed(0)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </div>

          {/* Current Lesson */}
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-2">{t('progress.currentLesson')}</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <LessonIcon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{currentLesson.title}</h4>
                <p className="text-sm text-muted-foreground">{currentLesson.duration}</p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span className="text-xs">{t('progress.timeSpent')}</span>
              </div>
              <p className="text-lg font-semibold">{timeSpent}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span className="text-xs">{t('progress.lastAccessed')}</span>
              </div>
              <p className="text-lg font-semibold">
                {new Date(lastAccessed).toLocaleDateString()}
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Target className="w-4 h-4" />
                <span className="text-xs">{t('progress.estimatedCompletion')}</span>
              </div>
              <p className="text-lg font-semibold">
                {new Date(estimatedCompletion).toLocaleDateString()}
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Zap className="w-4 h-4" />
                <span className="text-xs">{t('progress.learningStreak')}</span>
              </div>
              <p className="text-lg font-semibold">{streak} {t('progress.days')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            {t('progress.achievements')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  flex flex-col items-center p-4 rounded-lg border text-center
                  ${achievement.earned 
                    ? 'bg-primary/5 border-primary' 
                    : 'bg-muted border-muted-foreground/20 opacity-50'}
                `}
              >
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center mb-2
                  ${achievement.earned ? 'bg-primary/10' : 'bg-muted'}
                `}>
                  <Trophy className={`w-6 h-6 ${achievement.earned ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
                <p className="text-xs font-medium">{achievement.title}</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}