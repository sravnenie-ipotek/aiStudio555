'use client';

import { useState, useMemo } from 'react';
import { CourseData, CategoryData, CourseLevel } from '@/types/course';
import { CourseCard } from '@/components/cards/CourseCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Grid, List, ArrowUpDown, X, Loader2 } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/lib/utils';

interface CoursesCatalogProps {
  courses: CourseData[];
  categories: CategoryData[];
  className?: string;
  isLoading?: boolean;
}

type SortOption = 'popularity' | 'price-low' | 'price-high' | 'newest' | 'rating';
type DisplayMode = 'grid' | 'list';

export function CoursesCatalog({ 
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

  // Filter and sort courses
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

  const clearFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSelectedLevel('all');
    setPriceRange([0, 2000]);
    setSortBy('popularity');
  };

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
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {tSync('courses.catalog.title') || 'Выберите свой путь в AI'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {tSync('courses.catalog.subtitle') || 
             'Практические курсы от ведущих экспертов индустрии с гарантированным трудоустройством'}
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8 max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder={tSync('courses.catalog.search.placeholder') || 'Поиск курсов по названию, навыкам или профессии...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-4 py-4 text-lg border-2 border-gray-200 focus:border-primary-yellow rounded-xl"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              onClick={() => setSearchQuery('')}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Filters Section */}
        <div className="mb-12">
          
          {/* Category Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('all')}
              className={cn(
                "transition-all duration-200",
                selectedCategory === 'all' 
                  ? 'bg-primary-yellow text-black hover:bg-yellow-hover' 
                  : 'hover:border-primary-yellow hover:bg-primary-yellow/10'
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
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    "transition-all duration-200",
                    selectedCategory === category.id 
                      ? 'bg-primary-yellow text-black hover:bg-yellow-hover' 
                      : 'hover:border-primary-yellow hover:bg-primary-yellow/10'
                  )}
                >
                  {category.name?.ru || category.name?.en} ({categoryCount})
                </Button>
              );
            })}
          </div>

          {/* Additional Filters Row */}
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4 bg-gray-50 p-4 rounded-xl">
            
            {/* Level Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 min-w-max">
                {tSync('courses.catalog.filters.level') || 'Уровень:'}
              </span>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-primary-yellow focus:outline-none bg-white"
              >
                <option value="all">{tSync('courses.catalog.filters.allLevels') || 'Все уровни'}</option>
                <option value="beginner">{tSync('courses.catalog.filters.beginner') || 'Начинающий'}</option>
                <option value="intermediate">{tSync('courses.catalog.filters.intermediate') || 'Средний'}</option>
                <option value="advanced">{tSync('courses.catalog.filters.advanced') || 'Продвинутый'}</option>
              </select>
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-primary-yellow focus:outline-none bg-white"
              >
                <option value="popularity">{tSync('courses.catalog.sort.popularity') || 'По популярности'}</option>
                <option value="price-low">{tSync('courses.catalog.sort.priceLow') || 'Цена: по возрастанию'}</option>
                <option value="price-high">{tSync('courses.catalog.sort.priceHigh') || 'Цена: по убыванию'}</option>
                <option value="rating">{tSync('courses.catalog.sort.rating') || 'По рейтингу'}</option>
                <option value="newest">{tSync('courses.catalog.sort.newest') || 'Новые курсы'}</option>
              </select>
            </div>

            {/* Display Mode Toggle */}
            <div className="flex items-center gap-2 border border-gray-300 rounded-lg overflow-hidden">
              <Button
                variant={displayMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setDisplayMode('grid')}
                className={cn(
                  "rounded-none border-none",
                  displayMode === 'grid' ? 'bg-primary-yellow text-black' : 'hover:bg-gray-100'
                )}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={displayMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setDisplayMode('list')}
                className={cn(
                  "rounded-none border-none",
                  displayMode === 'list' ? 'bg-primary-yellow text-black' : 'hover:bg-gray-100'
                )}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-600">
                {tSync('courses.catalog.activeFilters') || 'Активные фильтры:'}
              </span>
              {selectedCategory !== 'all' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {categories.find(c => c.id === selectedCategory)?.name?.ru || 'Категория'}
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-red-500" 
                    onClick={() => setSelectedCategory('all')}
                  />
                </Badge>
              )}
              {selectedLevel !== 'all' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {selectedLevel}
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-red-500" 
                    onClick={() => setSelectedLevel('all')}
                  />
                </Badge>
              )}
              {searchQuery && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  "{searchQuery}"
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-red-500" 
                    onClick={() => setSearchQuery('')}
                  />
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-primary-yellow hover:text-yellow-hover"
              >
                {tSync('courses.catalog.clearFilters') || 'Сбросить все'}
              </Button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-8 text-center">
          <p className="text-gray-600">
            {tSync('courses.catalog.found') || 'Найдено'} <span className="font-semibold text-primary-yellow">{filteredAndSortedCourses.length}</span> {tSync('courses.catalog.coursesCount') || 'курсов'}
            {selectedCategory !== 'all' && (
              <span> в категории "{categories.find(c => c.id === selectedCategory)?.name?.ru}"</span>
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
          /* Empty State */
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
              className="bg-primary-yellow hover:bg-yellow-hover text-black font-semibold"
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
              className="border-primary-yellow text-primary-yellow hover:bg-primary-yellow hover:text-black font-semibold px-8 py-3"
            >
              {tSync('courses.catalog.loadMore') || 'Показать еще курсы'}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}