using AutoMapper;
using EventFinder.Application.DTOs;
using EventFinder.Domain.Entities;

namespace EventFinder.Application.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Guid <-> string
            CreateMap<Guid, string>().ConvertUsing(g => g.ToString());
            CreateMap<string, Guid>().ConvertUsing(s => Guid.Parse(s));

            // Event
            CreateMap<Event, EventDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id.ToString()))
                .ForMember(dest => dest.AmIMember, opt => opt.Ignore()) // set manually
                .ReverseMap()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => string.IsNullOrEmpty(src.Id) ? Guid.NewGuid() : Guid.Parse(src.Id)))
                .ForMember(dest => dest.OrganizerId, opt => opt.Ignore()) // set from auth context
                .ForMember(dest => dest.OrganizerName, opt => opt.Ignore())
                .ForMember(dest => dest.OrganizerAvatar, opt => opt.Ignore());

            // Review
            CreateMap<Review, ReviewDto>()
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.UserId))
                .ForMember(dest => dest.Date, opt => opt.MapFrom(src =>
                    src.Date.Kind == DateTimeKind.Utc
                        ? src.Date.ToString("o")   // "2026-04-24T17:48:10.1360000Z"
                        : src.Date.ToUniversalTime().ToString("o")))
                .ReverseMap()
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.UserId))
                .ForMember(dest => dest.Date, opt => opt.MapFrom(src =>
                    DateTime.Parse(src.Date, null, System.Globalization.DateTimeStyles.RoundtripKind)));

            // Profile
            CreateMap<User, ProfileDto>()
                // Id: Guid -> string
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id.ToString()))
                // Массив координат из двух отдельных полей
                .ForMember(dest => dest.Coordinates, opt => opt.MapFrom(src =>
                    src.CoordinateX == default && src.CoordinateY == default
                        ? null
                        : new double[] { src.CoordinateX, src.CoordinateY }))
                // Обратное направление (ProfileDto -> User)
                .ReverseMap()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src =>
                    string.IsNullOrEmpty(src.Id) ? Guid.NewGuid() : Guid.Parse(src.Id)))
                .ForMember(dest => dest.CoordinateX, opt => opt.MapFrom(src =>
                    src.Coordinates != null && src.Coordinates.Length >= 2 ? src.Coordinates[0] : default))
                .ForMember(dest => dest.CoordinateY, opt => opt.MapFrom(src =>
                    src.Coordinates != null && src.Coordinates.Length >= 2 ? src.Coordinates[1] : default));
            }
    }
}
