﻿// <auto-generated />
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using MythoticDiscordBot.DAL;

#nullable disable

namespace MythoticDiscordBot.DAL.Migrations.Migrations
{
    [DbContext(typeof(ServerConfigContext))]
    partial class ServerConfigContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "6.0.0")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder, 1L, 1);

            modelBuilder.Entity("MythoticDiscordBot.DAL.Models.ServerConfig.ServerConfig", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<string>("AdminRole")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ModeratorRole")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Prefix")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<decimal>("ServerId")
                        .HasColumnType("decimal(20,0)");

                    b.Property<string>("ServerName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("ServerConfigs");
                });
#pragma warning restore 612, 618
        }
    }
}
