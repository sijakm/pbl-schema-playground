using DotNetGeneratorApi.Models;
using DotNetGeneratorApi.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        });
});

var app = builder.Build();

app.UseCors("AllowAll");

app.MapPost("/api/generate", (GenerateRequest request) =>
{
    var generator = new CollaborativeMarkdownService();
    var result = generator.GenerateMarkdown(request.UnitTitle, request.Step0Json, request.LessonJsons);
    return Results.Ok(new { markdown = result });
});

app.MapPost("/api/generate/step0", (GenerateStep0Request request) =>
{
    var generator = new CollaborativeMarkdownService();
    var result = generator.GenerateStep0Markdown(request.UnitTitle, request.Step0Json);
    return Results.Ok(new { markdown = result });
});

app.MapPost("/api/generate/lessons", (GenerateLessonsRequest request) =>
{
    var generator = new CollaborativeMarkdownService();
    var result = generator.GenerateLessonsMarkdown(request.LessonJsons);
    return Results.Ok(new { markdown = result });
});

app.Run();
