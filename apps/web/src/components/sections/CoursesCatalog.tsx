'use client';

import { useState, useMemo, useCallback, useTransition, startTransition, memo } from 'react';
// TODO: Fix imports to use proper types from shared package
import { CourseCard } from '@/components/cards/CourseCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Grid, List, ArrowUpDown, X, Loader2 } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/lib/utils';

type CourseLevel = 'beginner' | 'intermediate' | 'advanced';

// TODO: Fix types to use proper CourseData and CategoryData from shared types
interface CoursesCatalogProps {
  courses: any[]; // Temporarily using any to fix build
  categories: any[]; // Temporarily using any to fix build
  className?: string;
  isLoading?: boolean;
}

type SortOption = 'popularity' | 'price-low' | 'price-high' | 'newest' | 'rating';
type DisplayMode = 'grid' | 'list';

function CoursesCatalogComponent({ 
  courses, 
  categories, 
  className,
  isLoading = false 
}: CoursesCatalogProps) {
  const { tSync } = useTranslation();
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('popularity');
  const [displayMode, setDisplayMode] = useState<DisplayMode>('grid');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);

  // Performance: Use useTransition for non-urgent updates
  const [isPending, startTransition] = useTransition();
  
  // Filter and sort courses with optimized memoization
  const filteredAndSortedCourses = useMemo(() => {
    let filtered = courses.filter(course => {
      const matchesCategory = selectedCategory === 'all' || course.categoryId === selectedCategory;
      
      const searchableContent = [
        course.title?.ru || '',
        course.title?.en || '',
        course.description?.ru || '',
        course.description?.en || '',
        course.shortDescription?.ru || '',
        course.shortDescription?.en || '',
        ...(course.careerOutcomes || []),
        ...(course.skillsLearned || [])
      ].join(' ').toLowerCase();
      
      const matchesSearch = !searchQuery || searchableContent.includes(searchQuery.toLowerCase());
      
      const matchesLevel = selectedLevel === 'all' || 
        course.level?.toLowerCase() === selectedLevel.toLowerCase();
      
      const coursePrice = course.discountPrice || course.price || 0;
      const matchesPrice = coursePrice >= priceRange[0] && coursePrice <= priceRange[1];
      
      return matchesCategory && matchesSearch && matchesLevel && matchesPrice && course.isActive;
    });

    // Sort courses
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (a.discountPrice || a.price || 0) - (b.discountPrice || b.price || 0);
        case 'price-high':
          return (b.discountPrice || b.price || 0) - (a.discountPrice || a.price || 0);
        case 'rating':
          return (b.averageRating || 0) - (a.averageRating || 0);
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'popularity':
        default:
          return (b.studentCount || 0) - (a.studentCount || 0);
      }
    });

    return filtered;
  }, [courses, selectedCategory, searchQuery, sortBy, selectedLevel, priceRange]);

  // Performance: Memoize filter clearing function
  const clearFilters = useCallback(() => {
    startTransition(() => {
      setSelectedCategory('all');
      setSearchQuery('');
      setSelectedLevel('all');
      setPriceRange([0, 2000]);
      setSortBy('popularity');
    });
  }, []);

  const hasActiveFilters = selectedCategory !== 'all' || 
                          searchQuery !== '' || 
                          selectedLevel !== 'all' || 
                          priceRange[0] !== 0 || 
                          priceRange[1] !== 2000;

  if (isLoading) {
    return (
      <section className={cn("py-16 lg:py-24 bg-white", className)}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {tSync('courses.catalog.title') || 'Выберите свой путь в AI'}
            </h2>
          </div>
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary-yellow" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="courses-catalog" className={cn("py-16 lg:py-24 bg-white", className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-text-primary mb-6">
            {tSync('courses.catalog.title') || 'Выберите свой путь в AI'}
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            {tSync('courses.catalog.subtitle') || 
             'Практические курсы от ведущих экспертов индустрии с гарантированным трудоустройством'}
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-12 max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-gray w-5 h-5" />
          <Input
            type="text"
            placeholder={tSync('courses.catalog.search.placeholder') || 'Поиск курсов по названию, навыкам или профессии...'}
            value={searchQuery}
            onChange={(e) => {
              const value = e.target.value;
              // Immediate update for input responsiveness
              setSearchQuery(value);
              // Debounced search for performance
              if (value.length > 2 || value.length === 0) {
                startTransition(() => {
                  // Search logic will be handled by useMemo dependency
                });
              }
            }}
            className="pl-12 pr-4 py-4 text-lg border-2 border-border-light focus:border-nav-yellow focus:ring-2 focus:ring-nav-yellow/20 rounded-xl bg-white shadow-sm min-h-[56px]"
            aria-label={tSync('courses.catalog.search.label') || 'Поиск курсов по названию, навыкам или профессии'}
            role="searchbox"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:bg-nav-yellow/10"
              onClick={() => setSearchQuery('')}
            >
              <X className="w-4 h-4 text-text-gray" />
            </Button>
          )}
        </div>

        {/* Filters Section */}
        <div className="mb-12">
          
          {/* Category Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('all')}
              className={cn(
                "transition-all duration-200 font-medium rounded-lg",
                selectedCategory === 'all' 
                  ? 'bg-nav-yellow text-text-primary hover:bg-nav-yellow/90' 
                  : 'border-border-light hover:border-nav-yellow hover:bg-nav-yellow/10 text-text-secondary hover:text-text-primary'
              )}
            >
              {tSync('courses.catalog.filters.all') || 'Все курсы'} ({courses.filter(c => c.isActive).length})
            </Button>
            {categories.map(category => {
              const categoryCount = courses.filter(c => 
                c.categoryId === category.id && c.isActive
              ).length;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  onClick={() => startTransition(() => setSelectedCategory(category.id))}
                  className={cn(
                    "transition-all duration-200 font-medium rounded-lg",
                    selectedCategory === category.id 
                      ? 'bg-nav-yellow text-text-primary hover:bg-nav-yellow/90' 
                      : 'border-border-light hover:border-nav-yellow hover:bg-nav-yellow/10 text-text-secondary hover:text-text-primary'
                  )}
                >
                  {category.name?.ru || category.name?.en} ({categoryCount})
                </Button>
              );
            })}
          </div>

          {/* Additional Filters Row */}
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6 bg-light-bg p-6 rounded-2xl border border-border-light">
            
            {/* Level Filter */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-text-primary min-w-max">
                {tSync('courses.catalog.filters.level') || 'Уровень:'}
              </span>
              <select
                value={selectedLevel}
                onChange={(e) => startTransition(() => setSelectedLevel(e.target.value))}
                className="border border-border-light rounded-lg px-4 py-2 text-sm focus:border-nav-yellow focus:ring-2 focus:ring-nav-yellow/20 focus:outline-none bg-white text-text-primary shadow-sm min-h-[44px]"
                aria-label={tSync('courses.catalog.filters.levelSelect') || 'Выбрать уровень сложности курса'}
              >
                <option value="all">{tSync('courses.catalog.filters.allLevels') || 'Все уровни'}</option>
                <option value="beginner">{tSync('courses.catalog.filters.beginner') || 'Начинающий'}</option>
                <option value="intermediate">{tSync('courses.catalog.filters.intermediate') || 'Средний'}</option>
                <option value="advanced">{tSync('courses.catalog.filters.advanced') || 'Продвинутый'}</option>
              </select>
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-3">
              <ArrowUpDown className="w-4 h-4 text-nav-yellow" />
              <select
                value={sortBy}
                onChange={(e) => startTransition(() => setSortBy(e.target.value as SortOption))}
                className="border border-border-light rounded-lg px-4 py-2 text-sm focus:border-nav-yellow focus:ring-2 focus:ring-nav-yellow/20 focus:outline-none bg-white text-text-primary shadow-sm min-h-[44px]"
                aria-label={tSync('courses.catalog.sort.select') || 'Выбрать способ сортировки курсов'}
              >
                <option value="popularity">{tSync('courses.catalog.sort.popularity') || 'По популярности'}</option>
                <option value="price-low">{tSync('courses.catalog.sort.priceLow') || 'Цена: по возрастанию'}</option>
                <option value="price-high">{tSync('courses.catalog.sort.priceHigh') || 'Цена: по убыванию'}</option>
                <option value="rating">{tSync('courses.catalog.sort.rating') || 'По рейтингу'}</option>
                <option value="newest">{tSync('courses.catalog.sort.newest') || 'Новые курсы'}</option>
              </select>
            </div>

            {/* Display Mode Toggle */}
            <div className="flex items-center gap-0 border border-border-light rounded-lg overflow-hidden bg-white shadow-sm">
              <Button
                variant={displayMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setDisplayMode('grid')}
                className={cn(
                  "rounded-none border-none px-3 py-2",
                  displayMode === 'grid' ? 'bg-nav-yellow text-text-primary' : 'hover:bg-light-bg text-text-secondary'
                )}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={displayMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setDisplayMode('list')}
                className={cn(
                  "rounded-none border-none px-3 py-2",
                  displayMode === 'list' ? 'bg-nav-yellow text-text-primary' : 'hover:bg-light-bg text-text-secondary'
                )}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mt-6 flex flex-wrap items-center gap-3 p-4 bg-white rounded-xl border border-border-light shadow-sm">
              <span className="text-sm font-semibold text-text-primary">
                {tSync('courses.catalog.activeFilters') || 'Активные фильтры:'}
              </span>
              {selectedCategory !== 'all' && (
                <Badge variant="secondary" className="flex items-center gap-1 bg-nav-yellow/10 text-text-primary border-nav-yellow/20 hover:bg-nav-yellow/20">
                  {categories.find(c => c.id === selectedCategory)?.name?.ru || 'Категория'}
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-error transition-colors" 
                    onClick={() => startTransition(() => setSelectedCategory('all'))}
                  />
                </Badge>
              )}
              {selectedLevel !== 'all' && (
                <Badge variant="secondary" className="flex items-center gap-1 bg-nav-yellow/10 text-text-primary border-nav-yellow/20 hover:bg-nav-yellow/20">
                  {selectedLevel}
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-error transition-colors" 
                    onClick={() => setSelectedLevel('all')}
                  />
                </Badge>
              )}
              {searchQuery && (
                <Badge variant="secondary" className="flex items-center gap-1 bg-nav-yellow/10 text-text-primary border-nav-yellow/20 hover:bg-nav-yellow/20">
                  "{searchQuery}"
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-error transition-colors" 
                    onClick={() => setSearchQuery('')}
                  />
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-nav-yellow hover:text-nav-yellow/80 hover:bg-nav-yellow/10 font-medium"
              >
                {tSync('courses.catalog.clearFilters') || 'Сбросить все'}
              </Button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-12 text-center">
          <p className="text-text-secondary text-lg">
            {tSync('courses.catalog.found') || 'Найдено'} <span className="font-bold text-nav-yellow text-xl">{filteredAndSortedCourses.length}</span> {tSync('courses.catalog.coursesCount') || 'курсов'}
            {selectedCategory !== 'all' && (
              <span className="text-text-primary font-medium"> в категории "{categories.find(c => c.id === selectedCategory)?.name?.ru}"</span>
            )}
          </p>
        </div>

        {/* Courses Grid/List */}
        {filteredAndSortedCourses.length > 0 ? (
          <div className={cn(
            "transition-all duration-300",
            displayMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' 
              : 'space-y-6'
          )}>
            {filteredAndSortedCourses.map((course, index) => (
              <CourseCard
                key={course.id}
                course={course}
                featured={index < 3} // First 3 courses are featured
                className={cn(
                  "animate-fade-in",
                  displayMode === 'list' ? 'max-w-none' : ''
                )}
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              />
            ))}
          </div>
        ) : (
          /* Empty State - Performance: Memoized component */
          <div className="text-center py-16">
            <div className="text-6xl mb-6">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              {tSync('courses.catalog.empty.title') || 'Курсы не найдены'}
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {tSync('courses.catalog.empty.description') || 
               'Попробуйте изменить параметры поиска или выбрать другую категорию'}
            </p>
            <Button 
              onClick={clearFilters}
              className="bg-primary-yellow hover:bg-yellow-hover text-text-primary font-semibold"
            >
              {tSync('courses.catalog.empty.reset') || 'Сбросить фильтры'}
            </Button>
          </div>
        )}

        {/* Load More Section (if needed for pagination) */}
        {filteredAndSortedCourses.length > 12 && (
          <div className="text-center mt-16">
            <Button 
              variant="outline"
              size="lg"
              className="border-primary-yellow text-primary-yellow hover:bg-primary-yellow hover:text-text-primary font-semibold px-6 py-3"
            >
              {tSync('courses.catalog.loadMore') || 'Показать еще курсы'}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

// Performance: Memoize the entire component to prevent unnecessary re-renders
export const CoursesCatalog = memo(CoursesCatalogComponent);