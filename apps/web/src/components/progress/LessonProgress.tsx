'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  PlayCircle, 
  CheckCircle, 
  Lock, 
  Clock, 
  ChevronRight,
  ChevronDown,
  BookOpen,
  Video,
  FileText,
  Target,
  Trophy,
  Star
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'reading' | 'quiz' | 'assignment';
  duration: string;
  completed: boolean;
  locked: boolean;
  progress?: number;
  resources?: Array<{
    id: string;
    title: string;
    type: string;
    url: string;
  }>;
}

interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  completedLessons: number;
  totalLessons: number;
}

interface LessonProgressProps {
  modules: Module[];
  onLessonSelect: (lessonId: string) => void;
  currentLessonId?: string;
}

export function LessonProgress({ modules, onLessonSelect, currentLessonId }: LessonProgressProps) {
  const { t } = useTranslation();
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set([modules[0]?.id]));

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video':
        return Video;
      case 'reading':
        return FileText;
      case 'quiz':
        return Target;
      case 'assignment':
        return Trophy;
      default:
        return BookOpen;
    }
  };

  const getLessonColor = (type: string) => {
    switch (type) {
      case 'video':
        return 'text-blue-500';
      case 'reading':
        return 'text-green-500';
      case 'quiz':
        return 'text-purple-500';
      case 'assignment':
        return 'text-orange-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-4">
      {modules.map((module, moduleIndex) => {
        const moduleProgress = (module.completedLessons / module.totalLessons) * 100;
        const isExpanded = expandedModules.has(module.id);

        return (
          <Card key={module.id} className="overflow-hidden">
            <CardContent className="p-0">
              {/* Module Header */}
              <button
                onClick={() => toggleModule(module.id)}
                className="w-full p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-semibold text-primary">
                        {moduleIndex + 1}
                      </span>
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold">{module.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {module.completedLessons}/{module.totalLessons} {t('progress.lessonsCompleted')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32">
                      <Progress value={moduleProgress} className="h-2" />
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </button>

              {/* Module Lessons */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t"
                  >
                    <div className="p-4 space-y-2">
                      {module.lessons.map((lesson, lessonIndex) => {
                        const LessonIcon = getLessonIcon(lesson.type);
                        const isActive = lesson.id === currentLessonId;
                        const isAccessible = !lesson.locked;

                        return (
                          <div
                            key={lesson.id}
                            className={`
                              group relative rounded-lg border p-3 transition-all
                              ${isActive ? 'bg-primary/5 border-primary' : 'hover:bg-muted/50'}
                              ${!isAccessible ? 'opacity-50' : 'cursor-pointer'}
                            `}
                            onClick={() => isAccessible && onLessonSelect(lesson.id)}
                          >
                            <div className="flex items-center gap-3">
                              {/* Lesson Status */}
                              <div className="relative">
                                {lesson.completed ? (
                                  <CheckCircle className="w-6 h-6 text-green-500" />
                                ) : lesson.locked ? (
                                  <Lock className="w-6 h-6 text-muted-foreground" />
                                ) : (
                                  <div className="w-6 h-6 rounded-full border-2 border-muted-foreground" />
                                )}
                                {lessonIndex < module.lessons.length - 1 && (
                                  <div className="absolute top-8 left-3 w-0.5 h-8 bg-muted-foreground/20" />
                                )}
                              </div>

                              {/* Lesson Info */}
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <LessonIcon className={`w-4 h-4 ${getLessonColor(lesson.type)}`} />
                                  <h4 className="font-medium">{lesson.title}</h4>
                                  {isActive && (
                                    <Badge variant="secondary" className="ml-2">
                                      {t('progress.current')}
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-4 mt-1">
                                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {lesson.duration}
                                  </span>
                                  {lesson.progress !== undefined && lesson.progress > 0 && (
                                    <div className="flex items-center gap-2">
                                      <Progress value={lesson.progress} className="w-20 h-1" />
                                      <span className="text-xs text-muted-foreground">
                                        {lesson.progress}%
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Action Button */}
                              {isAccessible && (
                                <Button
                                  size="sm"
                                  variant={lesson.completed ? 'outline' : 'default'}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onLessonSelect(lesson.id);
                                  }}
                                >
                                  {lesson.completed ? (
                                    <>{t('progress.review')}</>
                                  ) : lesson.progress && lesson.progress > 0 ? (
                                    <>{t('progress.continue')}</>
                                  ) : (
                                    <>{t('progress.start')}</>
                                  )}
                                </Button>
                              )}
                            </div>

                            {/* Resources */}
                            {lesson.resources && lesson.resources.length > 0 && (
                              <div className="mt-3 pt-3 border-t">
                                <p className="text-xs text-muted-foreground mb-2">
                                  {t('progress.resources')}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {lesson.resources.map(resource => (
                                    <Badge key={resource.id} variant="secondary" className="text-xs">
                                      {resource.title}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}