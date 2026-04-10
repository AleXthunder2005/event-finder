using System.Linq.Expressions;

namespace EventFinder.Application.Interfaces
{
    public interface IRepository<T> where T : class
    {
        Task<T?> GetByIdAsync(long id, params Expression<Func<T, object>>[] includes);
        Task<IEnumerable<T>> GetAllAsync(params Expression<Func<T, object>>[] includes);
        Task<T> AddAsync(T entity);
        T Update(T entity);
        void Delete(T entity);
        Task SaveChangesAsync();
    }
}