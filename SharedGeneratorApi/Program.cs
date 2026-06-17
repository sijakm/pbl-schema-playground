// using SharedGeneratorApi.Models;
using SharedGeneratorApi.Services;
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

// Configure the two services using their respective schema files
var collaborativeService = new MarkdownGeneratorService("prompts_collaborative.js");
var directService = new MarkdownGeneratorService("prompts.js");
var inquiryService = new MarkdownGeneratorService("prompts_inquiry.js");
var labService = new MarkdownGeneratorService("prompts_lab.js");
var lectureService = new MarkdownGeneratorService("prompts_lecture.js");
var pblService = new MarkdownGeneratorService("prompts_pbl.js");

// === Collaborative Markdown Endpoints ===
app.MapPost("/api/collaborative/generate", (SharedGeneratorApi.Models.Collaborative.GenerateRequest request) =>
{
    var result = collaborativeService.GenerateMarkdown(request.UnitTitle, request.Step0Json, request.LessonJsons, request.Language);
    return Results.Ok(new { markdown = result });
});

app.MapPost("/api/collaborative/generate/step0", (SharedGeneratorApi.Models.Collaborative.GenerateStep0Request request) =>
{
    var result = collaborativeService.GenerateStep0Markdown(request.UnitTitle, request.Step0Json, request.Language);
    return Results.Ok(new { markdown = result });
});

app.MapPost("/api/collaborative/generate/lessons", (SharedGeneratorApi.Models.Collaborative.GenerateLessonsRequest request) =>
{
    var result = collaborativeService.GenerateLessonsMarkdown(request.LessonJsons, request.Language);
    return Results.Ok(new { markdown = result });
});

// === Direct Instructions Markdown Endpoints ===
app.MapPost("/api/direct/generate", (SharedGeneratorApi.Models.Direct.GenerateRequest request) =>
{
    var result = directService.GenerateMarkdown(request.UnitTitle, request.Step0Json, request.LessonJsons, request.Language);
    return Results.Ok(new { markdown = result });
});

app.MapPost("/api/direct/generate/step0", (SharedGeneratorApi.Models.Direct.GenerateStep0Request request) =>
{
    var result = directService.GenerateStep0Markdown(request.UnitTitle, request.Step0Json, request.Language);
    return Results.Ok(new { markdown = result });
});

app.MapPost("/api/direct/generate/lessons", (SharedGeneratorApi.Models.Direct.GenerateLessonsRequest request) =>
{
    var result = directService.GenerateLessonsMarkdown(request.LessonJsons, request.Language);
    return Results.Ok(new { markdown = result });
});

// === Inquiry Markdown Endpoints ===
app.MapPost("/api/inquiry/generate", (SharedGeneratorApi.Models.Inquiry.GenerateRequest request) =>
{
    var result = inquiryService.GenerateMarkdown(request.UnitTitle, request.Step0Json, request.LessonJsons, request.Language);
    return Results.Ok(new { markdown = result });
});

app.MapPost("/api/inquiry/generate/step0", (SharedGeneratorApi.Models.Inquiry.GenerateStep0Request request) =>
{
    var result = inquiryService.GenerateStep0Markdown(request.UnitTitle, request.Step0Json, request.Language);
    return Results.Ok(new { markdown = result });
});

app.MapPost("/api/inquiry/generate/lessons", (SharedGeneratorApi.Models.Inquiry.GenerateLessonsRequest request) =>
{
    var result = inquiryService.GenerateLessonsMarkdown(request.LessonJsons, request.Language);
    return Results.Ok(new { markdown = result });
});

// === Lab Markdown Endpoints ===
app.MapPost("/api/lab/generate", (SharedGeneratorApi.Models.Lab.GenerateRequest request) =>
{
    var result = labService.GenerateMarkdown(request.UnitTitle, request.Step0Json, request.LessonJsons, request.Language);
    return Results.Ok(new { markdown = result });
});

app.MapPost("/api/lab/generate/step0", (SharedGeneratorApi.Models.Lab.GenerateStep0Request request) =>
{
    var result = labService.GenerateStep0Markdown(request.UnitTitle, request.Step0Json, request.Language);
    return Results.Ok(new { markdown = result });
});

app.MapPost("/api/lab/generate/lessons", (SharedGeneratorApi.Models.Lab.GenerateLessonsRequest request) =>
{
    var result = labService.GenerateLessonsMarkdown(request.LessonJsons, request.Language);
    return Results.Ok(new { markdown = result });
});

// === Lecture Markdown Endpoints ===
app.MapPost("/api/lecture/generate", (SharedGeneratorApi.Models.Lecture.GenerateRequest request) =>
{
    var result = lectureService.GenerateMarkdown(request.UnitTitle, request.Step0Json, request.LessonJsons, request.Language);
    return Results.Ok(new { markdown = result });
});

app.MapPost("/api/lecture/generate/step0", (SharedGeneratorApi.Models.Lecture.GenerateStep0Request request) =>
{
    var result = lectureService.GenerateStep0Markdown(request.UnitTitle, request.Step0Json, request.Language);
    return Results.Ok(new { markdown = result });
});

app.MapPost("/api/lecture/generate/lessons", (SharedGeneratorApi.Models.Lecture.GenerateLessonsRequest request) =>
{
    var result = lectureService.GenerateLessonsMarkdown(request.LessonJsons, request.Language);
    return Results.Ok(new { markdown = result });
});

// === Pbl Markdown Endpoints ===
app.MapPost("/api/pbl/generate", (SharedGeneratorApi.Models.Pbl.GenerateRequest request) =>
{
    // GenerateMarkdown expects step0Json, we will pass PblJson as step0Json and null for lessons
    var result = pblService.GenerateMarkdown(request.UnitTitle, request.PblJson, null, request.Language);
    return Results.Ok(new { markdown = result });
});

// Also keep the root endpoints that fall back to collaborative, 
// to avoid breaking if the frontend is not updated immediately
app.MapPost("/api/generate", (SharedGeneratorApi.Models.Collaborative.GenerateRequest request) =>
{
    var result = collaborativeService.GenerateMarkdown(request.UnitTitle, request.Step0Json, request.LessonJsons, request.Language);
    return Results.Ok(new { markdown = result });
});

app.MapPost("/api/generate/step0", (SharedGeneratorApi.Models.Collaborative.GenerateStep0Request request) =>
{
    var result = collaborativeService.GenerateStep0Markdown(request.UnitTitle, request.Step0Json, request.Language);
    return Results.Ok(new { markdown = result });
});

app.MapPost("/api/generate/lessons", (SharedGeneratorApi.Models.Collaborative.GenerateLessonsRequest request) =>
{
    var result = collaborativeService.GenerateLessonsMarkdown(request.LessonJsons, request.Language);
    return Results.Ok(new { markdown = result });
});

app.Run();
